import React from 'react'
import logo from './logo.svg'

import UserList from './UserList'
import './App.css'

const App = () => {

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
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
        <UserList />
      </div>
    </div>
  )
}

export default App
