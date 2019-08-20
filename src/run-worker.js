require('@std/esm')
const uuidv4 = require('uuid/v4')
const debug = require('debug')('node-jobs')

debug('Uniq id for worker life:', uuidv4())

const ApolloModule = require('apollo-client')
const ApolloClient = ApolloModule.default
const createNetworkInterface = ApolloModule.createNetworkInterface
const gql = require('graphql-tag')

const client = new ApolloClient({
  networkInterface: createNetworkInterface({
    uri: 'http://localhost:3000/graphql'
  })
})

const loopTime = 1000
var argv = require('minimist')(process.argv.slice(2))
debug(argv)

let workerType = argv.t ? argv.t : 'heightmap'
debug(
  `Starting a ${workerType} worker, will look for job every ${loopTime / 1000}s`
)

let WorkerClass = null
try {
  WorkerClass = require('./workers/' + workerType)
} catch (error) {
  debug('[error] Worker could not be loaded: ', error.message)
}
const worker = new WorkerClass()
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
`

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
`

function checkForJobs() {
  client
    .mutate({
      mutation: getNextJobQuery,
      variables: { type: 'commandline' }
    })
    .then(({ data: { getNextJob: job } }) => {
      if (!job) {
        setTimeout(checkForJobs, loopTime)
        return
      }
      debug('Reiceived a new job', job)
      worker
        .process(job)
        .then(job => {
          debug("Job's done", job.id)
          debug('Updating job')
          job.status = 'done'
          client
            .mutate({
              mutation: updateJobQuery,
              variables: job
            })
            .then(job => {
              debug('Job saved!', job)
              checkForJobs()
            })
        })
        .catch(error => {
          debug('Job failed', error)
        })
    })
    .catch(error => debug(error))
}

checkForJobs()
