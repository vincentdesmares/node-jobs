const express = require("express");
const { graphqlExpress, graphiqlExpress } = require("graphql-server-express");
const bodyParser = require("body-parser");
const { createServer } = require("http");
const { SubscriptionServer } = require("subscriptions-transport-ws");
const { execute, subscribe } = require("graphql");

class JobServer {
  constructor() {
    this.graphqlServer = express();
    this.WS_PORT = 5000;
    this.PORT = process.env.PORT || 8080;

    this.graphqlServer.set("port", this.PORT);

    // Express only serves static assets in production
    if (process.env.NODE_ENV === "production") {
      this.graphqlServer.use(express.static("build"));
    }

    this.graphqlServer.get("/generate", (req, res) => {
      res.json({
        message: "Success"
      });
    });

    this.myGraphQLSchema = require("./schema.js");

    // bodyParser is needed just for POST.
    this.graphqlServer.use(
      "/graphql",
      bodyParser.json(),
      graphqlExpress({ schema: this.myGraphQLSchema })
    );

    this.graphqlServer.use(
      "/graphiql",
      graphiqlExpress({
        endpointURL: "/graphql"
      })
    );

    this.wsServer = createServer(this.graphqlServer);
  }

  start() {
    this.wsServer.listen(this.WS_PORT, () => {
      console.log(
        `GraphQL Server is now running on http://localhost:${this.WS_PORT}`
      );
      // Set up the WebSocket for handling GraphQL subscriptions
      new SubscriptionServer(
        {
          execute,
          subscribe,
          schema: this.myGraphQLSchema
        },
        {
          server: this.wsServer,
          path: "/subscriptions"
        }
      );
    });

    this.graphqlServer.listen(this.PORT, () => {
      console.log(`Find the server at: http://localhost:${this.PORT}/`); // eslint-disable-line no-console
    });
  }
}

exports.default = JobServer;
