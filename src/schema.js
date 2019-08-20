const {
  generateModelTypes,
  generateApolloServer
} = require('graphql-sequelize-generator')
const { PubSub } = require('graphql-subscriptions')
const getModels = require('./models')

function getSchemaDeclaration(models) {
  const graphqlSchemaDeclaration = {}

  graphqlSchemaDeclaration.job = {
    model: models.job,
    actions: ['list', 'create', 'count']
  }
  graphqlSchemaDeclaration.batch = {
    model: models.batch,
    actions: ['list', 'create', 'delete']
  }
  graphqlSchemaDeclaration.pipeline = {
    model: models.pipeline,
    actions: ['list', 'create', 'update']
  }
  return graphqlSchemaDeclaration
}

module.exports = dbConfig => {
  const models = getModels(dbConfig)
  const types = generateModelTypes(models)
  const pubSubInstance = new PubSub()
  const graphqlSchemaDeclaration = getSchemaDeclaration(models)

  return generateApolloServer({
    graphqlSchemaDeclaration,
    types,
    models,
    pubSubInstance,
    apolloServerOptions: {
      playground: true
    }
  })
}
