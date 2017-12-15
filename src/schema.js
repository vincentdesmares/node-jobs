const { makeExecutableSchema } = require("graphql-tools");

const { Job, Project, Scene, Batch } = require("./models");

const { PubSub } = require("graphql-subscriptions");
const pubsub = new PubSub();

const typeDefs = `
  type Job {
    id: Int!
    type: String
    name: String
    input: String
    output: String
    status: String
    batch: Batch
  }
  type Scene {
    id: Int!
    name: String
    status: String
    metadata: String
    batches: [Batch]
  }
  type Batch {
    id: Int!
    status: String
    metadata: String
    project: Project
    scene: Scene
    jobs: [Job]
  }
  type Project {
    id: Int!
    name: String
    scenes: [Scene]
  }
  # the schema allows the following query:
  type Query {
    jobs: [Job]
    job(id: Int!): Job
    projects: [Project]
    project(id: Int!): Project
    scenes(projectId: Int): [Scene]
    scene(id: Int!): Scene,
    batches: [Batch]
    batch(id: Int!): Batch
  }
  # this schema allows the following mutation:
  type Mutation {
    addJob (
      type: String!
    ): Job
    addScene (
      name: String!
      projectId: Int!
    ): Scene
    getNextJob (
      type: String!
    ): Job
    updateJob(
      id: String
      type: String
      name: String
      input: String
      output: String
      status: String
    ): Job
    updateScene(
      id: Int!
      metadata: String
    ): Scene
    runGeneration(
      sceneId: Int!
    ): Scene
    deleteAllJobs (
      type: String
    ): String
    addProject (
      name: String!
    ): Project
  }
  type Subscription {
    jobUpdated(type: String): Job
  }
`;

// Load initial jobs
let jobs = [];
Job.findAll({
  where: {
    status: "pending"
  }
})
  .then(pendingJobs => {
    console.log(
      "Jobs still pending are loaded at server start",
      pendingJobs.map(job => job.id)
    );
    jobs = pendingJobs.map(job => job.id);
  })
  .catch(error => {
    console.log(error);
  });

const resolvers = {
  Query: {
    jobs: () => {
      return Job.findAll({ order: [["id", "desc"]] })
        .then(jobs => {
          return jobs;
        })
        .catch(function() {
          return [];
        });
    },
    job: (_, { id }) => Job.findById(id),
    projects: () => {
      console.log("projects called");
      return Project.findAll({
        order: [["id", "desc"]],
        include: [{ model: Scene, as: "scenes", include: ["batches"] }]
      })
        .then(projects => {
          return projects;
        })
        .catch(function(err) {
          console.log(err);
          return [];
        });
    },
    project: (_, { id }) =>
      Project.findById(id, {
        include: [
          {
            model: Scene,
            as: "scenes",
            include: [{ model: Batch, as: "batches", include: ["jobs"] }]
          }
        ]
      }),
    scenes: (_, { projectId }) => {
      console.log("scenes called");
      let where = {};
      if (projectId) {
        where.projectId = projectId;
      }
      return Scene.findAll({
        where,
        order: [["id", "desc"]],
        include: [
          {
            model: Batch,
            as: "batches",
            include: [{ model: Job, as: "jobs" }]
          }
        ]
      })
        .then(scenes => {
          return scenes;
        })
        .catch(function(err) {
          console.log(err);
          return [];
        });
    },
    scene: (_, { id }) =>
      Scene.findById(id, {
        include: [
          {
            model: Batch,
            as: "batches",
            include: [{ model: Job, as: "jobs" }]
          }
        ]
      }),
    batches: () => {
      console.log("batches called");
      return Batch.findAll({
        order: [["id", "desc"]]
      })
        .then(batches => {
          //projects[0].scenes = [{ id: 1 }];
          return batches;
        })
        .catch(function(err) {
          console.log(err);
          return [];
        });
    },
    batch: (_, { id }) => Batch.findById(id)
  },
  Mutation: {
    updateJob: (_, { id, output, status }) => {
      return Job.findById(id).then(function(job) {
        job.output = output;
        job.status = status;
        job.save();
        pubsub.publish("jobUpdated", { jobUpdated: job });
        return job;
      });
    },
    addJob: (_, { type }) => {
      return Job.create({
        type: type,
        name: "test 1",
        input: "test",
        output: "test2",
        status: "pending"
      }).then(function(job) {
        jobs.push(job.id);
        return job;
      });
    },
    addScene: (_, { name, projectId }) => {
      return Scene.create({
        name,
        projectId,
        metadata: "{}",
        status: "virgin"
      });
    },
    updateScene: (_, { id, metadata }) => {
      return Scene.findById(id).then(function(scene) {
        scene.metadata = metadata;
        scene.save();
        pubsub.publish("sceneUpdated", { sceneUpdated: scene });
        return scene;
      });
    },
    getNextJob: () => {
      if (jobs.length == 0) {
        return null;
      }
      let jobId = jobs.shift();
      return Job.findOne({
        where: {
          id: jobId
        }
      }).then(job => {
        job.status = "processing";
        job.save();
        pubsub.publish("jobUpdated", { jobUpdated: job });
        return job;
      });
    },
    deleteAllJobs: () => {
      jobs = [];
      return Job.destroy({ where: {} }).then(() => "destroyed");
    },
    addProject: (_, { name }) => {
      return Project.create({
        name
      }).then(function(project) {
        return project;
      });
    },
    runGeneration: async (_, { sceneId }) => {
      console.log(`Generating batches and jobs for scene ${sceneId}`);
      let scene = await Scene.findById(sceneId); //.then(scene => {
      console.log("scene found", scene);
      let metadata = JSON.parse(scene.metadata);
      metadata.generationId = metadata.generationId
        ? metadata.generationId + 1
        : 1;
      metadata.seed = metadata.seed ? metadata.seed : "default";
      for (let i = 0; i < metadata.steps.length; i++) {
        const step = metadata.steps[i];
        let batch = await Batch.create({
          projectId: scene.projectId,
          sceneId: scene.id,
          status: "pending"
        });
        metadata.steps[i].batchId = batch.id;
        if (step.slots) {
          for (let slotIndex = 0; slotIndex < step.slots.length; slotIndex++) {
            let slot = step.slots[slotIndex];
            let job = await Job.create({
              type: slot.type,
              name: `${slot.type} job`,
              status: "pending",
              batchId: batch.id,
              input: JSON.stringify({
                generationId: metadata.generationId,
                seed: metadata.seed
              })
            });
            jobs.push(job.id);
            metadata.steps[i].slots[slotIndex].jobId = job.id;
          }
        }
      }
      scene.metadata = JSON.stringify(metadata);
      await scene.save();
      return await Scene.findById(sceneId, {
        include: [
          {
            model: Batch,
            as: "batches",
            include: [{ model: Job, as: "jobs" }]
          }
        ]
      });
    }
  },
  Subscription: {
    jobUpdated: {
      subscribe: () => pubsub.asyncIterator("jobUpdated")
    }
  }
};

module.exports = makeExecutableSchema({
  typeDefs,
  resolvers
});
