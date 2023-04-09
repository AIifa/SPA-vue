import Vue from "vue"
import VueApollo from "vue-apollo"
import { ApolloClient } from "apollo-client"
import { InMemoryCache } from "apollo-cache-inmemory"
import { HttpLink } from "apollo-link-http"
import { URL } from "./config.js"

Vue.use(VueApollo);

Vue.config.productionTip = false;

const cache = new InMemoryCache();

export const apolloClient = new ApolloClient({
  cache,
  link: new HttpLink({uri: URL + "/graphql"})
});

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
});