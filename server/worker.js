require("@std/esm");
const uuidv4 = require("uuid/v4");

console.log("Uniq id for worker life:", uuidv4());

const ApolloModule = require("apollo-client");
const ApolloClient = ApolloModule.default;
const createNetworkInterface = ApolloModule.createNetworkInterface;
const gql = require("graphql-tag");

const client = new ApolloClient({
  networkInterface: createNetworkInterface({
    uri: "http://localhost:3000/graphql"
  })
});

const loopTime = 1000;
var argv = require("minimist")(process.argv.slice(2));
console.dir(argv);

let workerType = argv.t ? argv.t : "heightmap";
console.log(
  `Starting a ${workerType} worker, will look for job every ${loopTime / 1000}s`
);

let WorkerClass = null;
try {
  WorkerClass = require("./workers/" + workerType).default;
} catch (error) {
  console.log("[error] Worker could not be loaded: ", error.message);
}
const worker = new WorkerClass();
// client
//   .query({
//     query: gql`
//     query jobsListQuery {
//         jobs {
//             id
//             type
//             name
//             input
//             output
//         }
//     }
//   `
//   })
//   .then(data => console.log(data))
//   .catch(error => console.error(error));

const getNextJobQuery = gql`
  mutation getNextJob($type: String!) {
    getNextJob(type: $type) {
      id
      type
      name
      input
      output
    }
  }
`;

const updateJobQuery = gql`
  mutation updateJob(
    $id: String
    $type: String
    $name: String
    $input: String
    $output: String
    $status: String
  ) {
    updateJob(
      id: $id
      type: $type
      name: $name
      input: $input
      output: $output
      status: $status
    ) {
      id
      type
      name
      input
      output
      status
    }
  }
`;

function checkForJobs() {
  client
    .mutate({
      mutation: getNextJobQuery,
      variables: { type: "commandline" }
    })
    .then(({ data: { getNextJob: job } }) => {
      if (!job) {
        setTimeout(checkForJobs, loopTime);
        return;
      }
      console.log("Reiceived a new job", job);
      worker
        .process(job)
        .then(job => {
          console.log("Job's done", job.id);
          console.log("Updating job");
          job.status = "done";
          client
            .mutate({
              mutation: updateJobQuery,
              variables: job
            })
            .then(job => {
              console.log("Job saved!", job);
              checkForJobs();
            });
        })
        .catch(error => {
          console.log("Job failed", error);
        });
    })
    .catch(error => console.error(error));
}

checkForJobs();
