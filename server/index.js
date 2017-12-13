const express = require("express");
const { graphqlExpress, graphiqlExpress } = require("graphql-server-express");
const bodyParser = require("body-parser");
const { createServer } = require("http");
const app = express();
const { SubscriptionServer } = require("subscriptions-transport-ws");
const { execute, subscribe } = require("graphql");

app.set("port", process.env.PORT || 8080);

// Express only serves static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("build"));
}

app.get("/generate", (req, res) => {
  res.json({
    message: "Success"
  });
});

const myGraphQLSchema = require("./schema.js");

// bodyParser is needed just for POST.
app.use(
  "/graphql",
  bodyParser.json(),
  graphqlExpress({ schema: myGraphQLSchema })
);

app.use(
  "/graphiql",
  graphiqlExpress({
    endpointURL: "/graphql"
  })
);

const ws = createServer(app);
const PORT = 5000;
ws.listen(PORT, () => {
  console.log(`GraphQL Server is now running on http://localhost:${PORT}`);
  // Set up the WebSocket for handling GraphQL subscriptions
  new SubscriptionServer(
    {
      execute,
      subscribe,
      schema: myGraphQLSchema
    },
    {
      server: ws,
      path: "/subscriptions"
    }
  );
});

app.listen(app.get("port"), () => {
  console.log(`Find the server at: http://localhost:${app.get("port")}/`); // eslint-disable-line no-console
});
