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
import { ThemeProvider } from '@emotion/react'

import store from './app/store'
import theme from './theme'
import { getStoredToken } from './utils/loginData'
import logger from './utils/logger'

const authLink = setContext((_, { headers }) => {
  const token = getStoredToken()
  logger.info('AuthLink setContext: setting token to', token)

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null,
    },
  }
})

const API_ENDPOINT =
  process.env.REACT_APP_API_ENDPOINT ||
  'https://fstacktexter.azurewebsites.net/api'

const WS_ENDPOINT =
  process.env.REACT_APP_WS_ENDPOINT || 'wss://fstacktexter.azurewebsites.net'

const httpLink = createHttpLink({ uri: `${API_ENDPOINT}` })
const wsLink = new GraphQLWsLink(
  createClient({
    url: `${WS_ENDPOINT}`,
  })
)

logger.info('API_ENDPOINT', API_ENDPOINT)
logger.info('WS_ENDPOINT', WS_ENDPOINT)

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
  uri: `${API_ENDPOINT}`,
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
