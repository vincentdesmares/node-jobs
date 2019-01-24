const {
  generateModelTypes,
  generateGraphqlExpressMiddleware,
  generateSchema
} = require('graphql-sequelize-generator')
const { PubSub } = require('graphql-subscriptions')

const models = require('./models')

const graphqlSchemaDeclaration = {}
const modelTypes = generateModelTypes(models)
const pubSubInstance = new PubSub()

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

module.exports = {
  server: generateGraphqlExpressMiddleware(
    graphqlSchemaDeclaration,
    modelTypes,
    models,
    pubSubInstance,
    {
      playground: true
    }
  ),
  schema: generateSchema(graphqlSchemaDeclaration, modelTypes, models)
}
