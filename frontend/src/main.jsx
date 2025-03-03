import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

import App from "./App.jsx";
import GridBackground from "./components/ui/GridBackground.jsx";
import "./index.css";

const client = new ApolloClient({
  uri:
    import.meta.env.VITE_NODE_ENV === "development"
      ? "http://localhost:4000/graphql"
      : "https://expense-tracker-app-mnjg.onrender.com/graphql", // URL of our GraphQL server
  cache: new InMemoryCache(), // Apollo Client uses this to cache query results after fetching them
  credentials: "include", // this tells Apollo Client to send cookies along with every request to the server
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <GridBackground>
        <ApolloProvider client={client}>
          <App />
        </ApolloProvider>
      </GridBackground>
    </BrowserRouter>
  </React.StrictMode>
);
