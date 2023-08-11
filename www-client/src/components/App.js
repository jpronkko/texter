import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  BrowserRouter as Router,
  Routes, Route, Link
} from 'react-router-dom'

import { addGroup } from '../app/userSlice'

import GroupList from './GroupList'
import UserList from './pages/UserList'
import ErrorMessage from './ErrorMessage'
import CreateGroupForm from './forms/CreateGroupForm'

import './App.css'
import './TopBar'

import CreateUser from './pages/CreateUser'
import Login from './pages/Login'

import logger from '../utils/logger'
import TopBar from './TopBar'
import useCreateGroup from '../hooks/useCreateGroup'

const MainPage = () => {
  return (
    <div>
      Main Page
    </div>
  )
}

const App = () => {
  const userLoggedIn = useSelector(state => state.user.username)
  const userGroups = useSelector(state => state.user.groups)

  const [isCreatingGroup, setIsCreatingGroup] = useState(false)
  const [createGroup, ] = useCreateGroup()

  const dispatch = useDispatch()

  console.log(userLoggedIn)
  console.log('User groups', userGroups)
  const handleCreateUser = async (data) => {
    logger.info('Create user input data:', data)
  }

  const loginUser = async (data) => {
    logger.info('Login user input data:', data)
  }

  const padding = {
    padding: 5
  }

  const handleCreateGroup = async (name) => {
    console.log('Creating group', name)
    const id = await createGroup(name)
    dispatch(addGroup(id))
    setIsCreatingGroup(false)
  }

  return (
    <div>
      <Router>
        <TopBar />
        <p>{userLoggedIn !== '' ? `user logged in ${userLoggedIn}` : 'user logged out'}</p>
        <ErrorMessage />
        { userLoggedIn !== '' && isCreatingGroup && <CreateGroupForm handleCreate={handleCreateGroup} /> }
        <div>
          <Link style={padding} to='/'>home</Link>
          <Link style={padding} to='/users'>Users</Link>
          <Link style={padding} to='/create_account'>Create Account</Link>
        </div>
        <GroupList />
        <Routes>
          <Route path='/' element={<MainPage />} />
          <Route path='/login' element={<Login handleLogin={loginUser}/>} />
          <Route path='/groups' element={<GroupList />} />
          <Route path='/users' element={<UserList />} />
          <Route path='/create_account' element={<CreateUser handleCreate={handleCreateUser} />} />
        </Routes>
      </Router>
    </div>
  )
}


export default App