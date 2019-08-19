const express = require('express')
const { createServer } = require('http')
const { server } = require('./schema.js')

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

    this.httpServer = createServer(this.app)
    server.installSubscriptionHandlers(this.httpServer)
  }

  async start() {
    return new Promise((resolve, reject) => {
      this.httpServer.listen(this.PORT, () => {
        console.log(`Find the server at: http://localhost:${this.PORT}/`) // eslint-disable-line no-console
        resolve(this.httpServer)
      })
    })
  }

  async stop() {
    console.log('stoping web socket server')
    await new Promise((resolve, reject) =>
      this.httpServer.close(() => {
        console.log('http server stopped')
        resolve()
      })
    )
    // console.log('stoping graphql server')
    // await new Promise((resolve, reject) =>
    //   this.app.close(() => {
    //     console.log('grapgql server stopped')
    //     resolve()
    //   })
    // )
  }

  getGraphqlServer() {
    return this.httpServer
  }
}

module.exports = JobServer
