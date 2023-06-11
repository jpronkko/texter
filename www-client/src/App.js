import logo from './logo.svg';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client'
import Button from '@mui/material/Button'

import './App.css';


const client = new ApolloClient({
  uri: 'http://localhost:4000',
  cache: new InMemoryCache(),
})

const query = gql`
  query {
    allUsers {
      username,
      name,
      id
    }
  }`

client.query({ query })
  .then((response) => {
    console.log(response.data)
  })

function App() {

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <div>
        <Button variant="contained">Hello World</Button>
    </div>
    </div>
  );
}

export default App;
