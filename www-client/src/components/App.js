import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { logIn, logOut } from '../app/userSlice'

import UserList from './UserList'
import './App.css'
import './TopBar'

import CreateUserForm from './forms/CreateUserForm'
import useCreateUser from '../hooks/useCreateUser'

import {
  BrowserRouter as Router,
  Routes, Route, Link
} from 'react-router-dom'

import logger from '../utils/logger'
import TopBar from './TopBar'
const MainPage = () => {
  return (
    <div>
      Main Page
    </div>
  )
}

const App = () => {
  const [createUser, result] = useCreateUser()
  const userLoggedIn = useSelector(state => state.user.hasLoggedIn)
  const dispatch = useDispatch()

  const handleCreate = async (data) => {
    logger.info('Create user input data:', data)
    const foo = await createUser(data)
    logger.info('foo on handlecreate', foo)
    dispatch(logIn())
    dispatch(logOut())
  }

  logger.info('result of createUser', result)
  /*logger.info(JSON.stringify(data))
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error...{error.message}</p>*/
  const padding = {
    padding: 5
  }

  return (
    <div>
      <Router>
        <TopBar />
        <p>{userLoggedIn ? 'user logged in' : 'user logged out'}</p>
        <div>
          <Link style={padding} to='/'>home</Link>
          <Link style={padding} to='/users'>Users</Link>
          <Link style={padding} to='/create_account'>Create Account</Link>
        </div>

        <Routes>
          <Route path='/' element={<MainPage />} />
          <Route path='/users' element={<UserList />} />
          <Route path='/create_account' element={<CreateUserForm handleCreate={handleCreate} />} />
        </Routes>
      </Router>
    </div>
  )
}

/*
   <div className="App">
      <TopBar />
      <div>
        {userLoggedIn ? 'User has logged in' : 'User has not logged in'}
      </div>
      <div>
        <CreateUserForm handleCreate={handleCreate} />
      </div>
      <div>
        <UserList />
      </div>
    </div>
*/
export default App