const { makeExecutableSchema } = require("graphql-tools");

const { job, pipeline, build, batch } = require("./models");

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
  type Build {
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
    build: Build
    jobs: [Job]
  }
  type Pipeline {
    id: Int!
    name: String
    builds: [Build]
  }
  # the schema allows the following query:
  type Query {
    jobs: [Job]
    job(id: Int!): Job
    pipelines: [Pipeline]
    pipeline(id: Int!): Pipeline
    builds(projectId: Int): [Build]
    build(id: Int!): Build,
    batches: [Batch]
    batch(id: Int!): Batch
  }
  # this schema allows the following mutation:
  type Mutation {
    addJob (
      type: String!
    ): Job
    addBuild (
      name: String!
      projectId: Int!
    ): Build
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
    updateBuild(
      id: Int!
      metadata: String
    ): Build
    runPipeline(
      sceneId: Int!
    ): Build
    deleteAllJobs (
      type: String
    ): String
    addPipeline (
      name: String!
    ): Pipeline
  }
  type Subscription {
    jobUpdated(type: String): Job
  }
`;

// Load initial jobs
let jobs = [];
job
  .findAll({
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
      return job
        .findAll({ order: [["id", "desc"]] })
        .then(jobs => {
          return jobs;
        })
        .catch(function() {
          return [];
        });
    },
    job: (_, { id }) => job.findById(id),
    pipelines: () => {
      return pipeline
        .findAll({
          order: [["id", "desc"]],
          include: [{ model: build, as: "builds" }]
          //include: [{ model: build, as: "builds", include: ["batches"] }]
        })
        .then(pipelines => {
          return pipelines;
        })
        .catch(function(err) {
          console.log(err);
          return [];
        });
    },
    pipeline: (_, { id }) =>
      pipeline.findById(id, {
        include: [
          {
            model: build,
            as: "builds"
          }
        ]
      }),
    builds: (_, {}) => {
      return build
        .findAll({
          order: [["id", "desc"]],
          include: [
            {
              model: batch,
              as: "batches"
            }
          ]
        })
        .then(builds => {
          return builds;
        })
        .catch(function(err) {
          console.log(err);
          return [];
        });
    },
    build: (_, { id }) =>
      build.findById(id, {
        include: [
          {
            model: build,
            as: "batches",
            include: [{ model: job, as: "jobs" }]
          }
        ]
      }),
    batches: () => {
      console.log("batches called");
      return batch
        .findAll({
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
    batch: (_, { id }) => batch.findById(id)
  },
  Mutation: {
    updateJob: (_, { id, output, status }) => {
      return job.findById(id).then(function(job) {
        job.output = output;
        job.status = status;
        job.save();
        pubsub.publish("jobUpdated", { jobUpdated: job });
        return job;
      });
    },
    addJob: (_, { type }) => {
      return job
        .create({
          type: type,
          name: "test 1",
          input: "test",
          output: "test2",
          status: "pending"
        })
        .then(function(job) {
          jobs.push(job.id);
          return job;
        });
    },
    addBuild: (_, { name, projectId }) => {
      return build.create({
        name,
        projectId,
        metadata: "{}",
        status: "virgin"
      });
    },
    updateBuild: (_, { id, metadata }) => {
      return build.findById(id).then(function(scene) {
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
      return job
        .findOne({
          where: {
            id: jobId
          }
        })
        .then(job => {
          job.status = "processing";
          job.save();
          pubsub.publish("jobUpdated", { jobUpdated: job });
          return job;
        });
    },
    deleteAllJobs: () => {
      jobs = [];
      return job.destroy({ where: {} }).then(() => "destroyed");
    },
    addPipeline: (_, { name }) => {
      return pipeline
        .create({
          name
        })
        .then(function(project) {
          return project;
        });
    },
    runPipeline: async (_, { pipelineId }) => {
      console.log(
        `Generating a build, batches and jobs for the pipeline ${pipelineId}`
      );
      let pipeline = await pipeline.findById(pipelineId); //.then(scene => {
      console.log("Pipeline found", pipeline);
      // let metadata = JSON.parse(scene.metadata);
      // metadata.generationId = metadata.generationId
      //   ? metadata.generationId + 1
      //   : 1;
      // metadata.seed = metadata.seed ? metadata.seed : "default";
      // for (let i = 0; i < metadata.steps.length; i++) {
      //   const step = metadata.steps[i];
      //   let batch = await Batch.create({
      //     projectId: scene.projectId,
      //     sceneId: scene.id,
      //     status: "pending"
      //   });
      //   metadata.steps[i].batchId = batch.id;
      //   if (step.slots) {
      //     for (let slotIndex = 0; slotIndex < step.slots.length; slotIndex++) {
      //       let slot = step.slots[slotIndex];
      //       let job = await job.create({
      //         type: slot.type,
      //         name: `${slot.type} job`,
      //         status: "pending",
      //         batchId: batch.id,
      //         input: JSON.stringify({
      //           generationId: metadata.generationId,
      //           seed: metadata.seed
      //         })
      //       });
      //       jobs.push(job.id);
      //       metadata.steps[i].slots[slotIndex].jobId = job.id;
      //     }
      //   }
      // }
      // scene.metadata = JSON.stringify(metadata);
      // await scene.save();
      // return await Scene.findById(sceneId, {
      //   include: [
      //     {
      //       model: Batch,
      //       as: "batches",
      //       include: [{ model: job, as: "jobs" }]
      //     }
      //   ]
      // });
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
