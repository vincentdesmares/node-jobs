import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import {
  SubscriptionClient,
  addGraphQLSubscriptions
} from "subscriptions-transport-ws";
import { BrowserRouter } from "react-router-dom";
import {
  ApolloClient,
  ApolloProvider,
  createNetworkInterface
} from "react-apollo";
import { reducer as formReducer } from "redux-form";
import { Provider } from "react-redux";

import "./index.css";

const wsClient = new SubscriptionClient(`ws://localhost:5000/subscriptions`, {
  reconnect: true,
  connectionParams: {}
});

// Create regular NetworkInterface by using apollo-client's API:
const networkInterface = createNetworkInterface({
  uri: "/graphql"
});

const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
  networkInterface,
  wsClient
);

const client = new ApolloClient({
  networkInterface: networkInterfaceWithSubscriptions
});

const store = createStore(
  combineReducers({
    apollo: client.reducer(),
    form: formReducer
  }),
  {}, // initial state
  compose(
    applyMiddleware(client.middleware()),
    // If you are using the devToolsExtension, you can add it here also
    typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== "undefined"
      ? window.__REDUX_DEVTOOLS_EXTENSION__()
      : f => f
  )
);

ReactDOM.render(
  <ApolloProvider client={client}>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </ApolloProvider>,
  document.getElementById("root")
);
registerServiceWorker();
