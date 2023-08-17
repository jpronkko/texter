import React from 'react'
import { useSelector } from 'react-redux'

import {
  BrowserRouter as Router,
  Routes, Route, Link
} from 'react-router-dom'

import Button from '@mui/material/Button'

import GroupList from './GroupList'
import UserList from './pages/UserList'
import ErrorMessage from './ErrorMessage'
import ConfirmMessage from './ConfirmMessage'

import './App.css'
import './TopBar'

import CreateUser from './pages/CreateUser'
import Login from './pages/Login'

import logger from '../utils/logger'
import TopBar from './TopBar'
import useConfirmMessage from '../hooks/useConfirmMessage'

const MainPage = () => {
  return (
    <div>
      Main Page
    </div>
  )
}

const App = () => {

  const user = useSelector(state => state.user.userData)
  const [ showMessage ] = useConfirmMessage()

  console.log('User', user)

  const userLoggedIn = () => user.username !== ''

  const handleCreateUser = async (data) => {
    logger.info('Create user input data:', data)
  }

  const loginUser = async (data) => {
    logger.info('Login user input data:', data)
  }

  const padding = {
    padding: 5
  }

  return (
    <div>
      <Router>
        <TopBar />
        <p>{ userLoggedIn() ? `user logged in ${user.username}` : 'user logged out' }</p>
        <ErrorMessage />
        <ConfirmMessage />
        <Button onClick={() => showMessage('jddj', 'kgfjgj')}>Click</Button>
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