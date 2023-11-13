import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './components/App'
import { Provider } from 'react-redux'

//import reportWebVitals from './reportWebVitals'
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
  split,
} from '@apollo/client'

import { setContext } from '@apollo/client/link/context'

import { getMainDefinition } from '@apollo/client/utilities'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'

import store from './app/store'
import logger from './utils/logger'
import theme from './theme'
import { ThemeProvider } from '@emotion/react'

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('texter-token')
  logger.info('Setting token to', token)
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null,
    },
  }
})

const httpLink = createHttpLink({ uri: 'http://localhost:4000' })
const wsLink = new GraphQLWsLink(
  createClient({
    url: 'ws://localhost:4000',
  })
)

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  //httpLink
  authLink.concat(httpLink)
)

const client = new ApolloClient({
  //uri: 'http://localhost:4000',
  connectToDevTools: true,
  cache: new InMemoryCache(),
  link: splitLink,
})

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <Provider store={store}>
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </ApolloProvider>
  </Provider>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
