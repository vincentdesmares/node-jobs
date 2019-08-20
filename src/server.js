const express = require('express')
const { createServer } = require('http')
const getServer = require('./schema.js')
const debug = require('debug')('node-jobs')

class JobServer {
  /**
   *
   * @param {Object} parameters
   * @param {Object} parameters.dbConfig A sequelize configuration
   * @param {Object} parameters.app An express app if already available
   * @param {Object} parameters.httpServer An httpServer if already available
   */
  constructor({ dbConfig, app, httpServer }) {
    if (!dbConfig) {
      throw new Error(
        'You must specify at least a database configuration under dbConfig.'
      )
    }

    if (app) {
      this.app = app
    } else {
      // If NJ runs in standalone mode, we create an express server
      this.app = express()
      this.PORT = process.env.PORT || 8080
      this.app.set('port', this.PORT)
    }
    const server = getServer(dbConfig)

    /**
     * This is the test server.
     * Used to allow the access to the Graphql Playground at this address: http://localhost:8080/graphql.
     * Each time the server is starter, the database is reset.
     */
    server.applyMiddleware({
      app: this.app,
      path: '/graphql'
    })

    if (app) {
      server.installSubscriptionHandlers(httpServer)
    } else {
      // In standalone mode we have to setup the subscriptions
      this.httpServer = createServer(this.app)
      server.installSubscriptionHandlers(this.httpServer)
    }
  }

  async start() {
    return new Promise((resolve, reject) => {
      this.httpServer.listen(this.PORT, () => {
        debug(`Find the server at: http://localhost:${this.PORT}/graphql`) // eslint-disable-line no-console
        resolve(this.httpServer)
      })
    })
  }

  async stop() {
    debug('stoping web socket server')
    await new Promise((resolve, reject) =>
      this.httpServer.close(() => {
        debug('http server stopped')
        resolve()
      })
    )
  }

  getGraphqlServer() {
    return this.httpServer
  }
}

module.exports = JobServer
