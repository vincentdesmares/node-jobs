const express = require('express')
const { createServer } = require('http')
const { SubscriptionServer } = require('subscriptions-transport-ws')
const { execute, subscribe } = require('graphql')
const { server, schema } = require('./schema.js')

class JobServer {
  constructor() {
    this.app = express()
    this.WS_PORT = 5000
    this.PORT = process.env.PORT || 8080

    this.app.set('port', this.PORT)
    /**
     * This is the test server.
     * Used to allow the access to the Graphql Playground at this address: http://localhost:8080/graphql.
     * Each time the server is starter, the database is reset.
     */
    server.applyMiddleware({
      app: this.app,
      path: '/graphql'
    })

    this.wsServer = createServer(this.app)
  }

  async start() {
    await new Promise((resolve, reject) => {
      this.wsServer.listen(this.WS_PORT, () => {
        console.log(
          `GraphQL Server is now running on http://localhost:${
            this.WS_PORT
          }/graphql`,
          `GraphiQL also available on http://localhost:${this.WS_PORT}/graphiql`
        )
        // Set up the WebSocket for handling GraphQL subscriptions
        const ss = new SubscriptionServer(
          {
            execute,
            subscribe,
            schema
          },
          {
            server: this.wsServer,
            path: '/subscriptions'
          }
        )
        resolve(ss)
      })
    })

    await new Promise((resolve, reject) => {
      this.app.listen(this.PORT, () => {
        console.log(`Find the server at: http://localhost:${this.PORT}/`) // eslint-disable-line no-console
        resolve()
      })
    })
  }

  async stop() {
    console.log('stoping web socket server')
    await new Promise((resolve, reject) =>
      this.wsServer.close(() => {
        console.log('ws server stopped')
        resolve()
      })
    )
    console.log('stoping graphql server')
    await new Promise((resolve, reject) =>
      this.app.close(() => {
        console.log('grapgql server stopped')
        resolve()
      })
    )
  }

  getGraphqlServer() {
    return this.app
  }
}

module.exports = JobServer
