import Vue from 'vue'
import VueApollo from 'vue-apollo'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
Vue.use(VueApollo);

Vue.config.productionTip = false;

const cache = new InMemoryCache();

export const apolloClient = new ApolloClient({
  cache,
  link: new HttpLink({uri: "http://localhost:3000/graphql"})
});

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
});