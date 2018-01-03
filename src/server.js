const express = require("express");
const { graphqlExpress, graphiqlExpress } = require("apollo-server-express");
const bodyParser = require("body-parser");
const { createServer } = require("http");
const { SubscriptionServer } = require("subscriptions-transport-ws");
const { execute, subscribe } = require("graphql");
const myGraphQLSchema = require("./schema.js");

class JobServer {
  constructor() {
    this.graphqlServer = express();
    this.WS_PORT = 5000;
    this.PORT = process.env.PORT || 8080;

    this.graphqlServer.set("port", this.PORT);

    // bodyParser is needed just for POST.
    this.graphqlServer.use(
      "/graphql",
      bodyParser.json(),
      graphqlExpress({ schema: myGraphQLSchema })
    );

    this.graphqlServer.use(
      "/graphiql",
      graphiqlExpress({
        endpointURL: "/graphql"
      })
    );

    this.wsServer = createServer(this.graphqlServer);
  }

  async start() {
    await new Promise((resolve, reject) => {
      this.wsServer.listen(this.WS_PORT, () => {
        console.log(
          `GraphQL Server is now running on http://localhost:${
            this.WS_PORT
          }/graphql`,
          `GraphiQL also available on http://localhost:${this.WS_PORT}/graphiql`
        );
        // Set up the WebSocket for handling GraphQL subscriptions
        new SubscriptionServer(
          {
            execute,
            subscribe,
            schema: myGraphQLSchema
          },
          {
            server: this.wsServer,
            path: "/subscriptions"
          }
        );
        resolve();
      });
    });

    await new Promise((resolve, reject) => {
      this.graphqlServer.listen(this.PORT, () => {
        console.log(`Find the server at: http://localhost:${this.PORT}/`); // eslint-disable-line no-console
        resolve();
      });
    });
  }

  async stop() {
    console.log("stoping web socket server");
    await new Promise((resolve, reject) =>
      this.wsServer.close(() => {
        console.log("ws server stopped");
        resolve();
      })
    );
    console.log("stoping graphql server");
    await new Promise((resolve, reject) =>
      this.graphqlServer.close(() => {
        console.log("grapgql server stopped");
        resolve();
      })
    );
  }

  getGraphqlServer() {
    return this.graphqlServer;
  }
}

module.exports = JobServer;
