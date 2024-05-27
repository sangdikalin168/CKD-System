import ReactDOM from "react-dom/client";
const API_BASE_URL = import.meta.env.VITE_API_URL;
import App from "./App.tsx";
import "../src/index.css";
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  from,
  InMemoryCache,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";
import AuthContextProvider from "./context/AuthContext";
import JWTManager from "./utils/jwt";
import { toastify } from "./utils/toastify.tsx";

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) => {
      toastify(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
        true,
        "error"
      );
    });
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const httpLink = createHttpLink({
  uri: API_BASE_URL,
  credentials: "include",
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from JWTManager if it exists
  const token = JWTManager.getAccessToken();

  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  //link: authLink.concat(httpLink),
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <ApolloProvider client={client}>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </ApolloProvider>
);

postMessage({ payload: "removeLoading" }, "*");
