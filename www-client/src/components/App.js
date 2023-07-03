import React from 'react'

import UserList from './UserList'
import './App.css'
import './TopBar'

import CreateUserForm from './forms/CreateUserForm'
//import { useMutation } from '@apollo/client'

//import { CREATE_USER } from '../graphql/mutations'
import useCreateUser from '../hooks/useCreateUser'

import logger from '../utils/logger'
import TopBar from './TopBar'

const App = () => {
  //const [createUser, { loading, error, data }] = useMutation(CREATE_USER)
  const [createUser, result] = useCreateUser()
  const handleCreate = async (data) => {
    logger.info('Create user input data:', data)
    const foo = await createUser(data)
    logger.info('foo on handlecreate', foo)
    // createUser(
    //   { variables: { ...data.input } })
  }

  logger.info('result of createUser', result)
  /*logger.info(JSON.stringify(data))
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error...{error.message}</p>*/

  return (
    <div className="App">
      <TopBar />
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