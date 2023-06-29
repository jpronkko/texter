import React from 'react'
import logo from './logo.svg'

import UserList from '../UserList'
import './App.css'

import CreateUserForm from './forms/CreateUserForm'
import { useMutation } from '@apollo/client'

import { CREATE_USER } from '../graphql/mutations'
import logger from '../utils/logger'

const App = () => {
  const [createUser, { loading, error, data }] = useMutation(CREATE_USER)

  const handleCreate = (data) => {
    logger.info('Dataa!', data)
    createUser(
      { variables: {
        name: data.name,
        email: data.email,
        username: data.username,
        password: data.password,
      } })
  }

  logger.info(JSON.stringify(data))
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error...{error.message}</p>

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <div>
        <CreateUserForm handleCreate={handleCreate} />
      </div>
      <div>
        <UserList />
      </div>
    </div>
  )
}

export default App