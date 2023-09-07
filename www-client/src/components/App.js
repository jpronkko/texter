//* eslint-disable no-unused-vars */
import React from 'react'
import { useSelector } from 'react-redux'

import {
  BrowserRouter as Router,
  Routes, Route,
} from 'react-router-dom'

import { Toolbar } from '@mui/material'

import MainPage from './pages/MainPage'
import UserList from './pages/UserList'
import ErrorMessage from './ErrorMessage'
import ConfirmMessage from './ConfirmMessage'

import CreateUser from './pages/CreateUser'
import Login from './pages/Login'

import logger from '../utils/logger'
import TopBar from './TopBar'


const App = () => {

  const user = useSelector(state => state.user.userData)

  console.log('User now', user)

  // const userLoggedIn = () => user.username !== ''

  const handleCreateUser = async (data) => {
    logger.info('Create user input data:', data)
  }

  const loginUser = async (data) => {
    logger.info('Login user input data:', data)
  }

  return (
    <div>
      <Router>
        <ConfirmMessage />
        <ErrorMessage />
        <TopBar/>
        <Toolbar />
        <Routes>
          <Route path='/' element={<MainPage />} />
          <Route path='/create_account' element={<CreateUser handleCreate={handleCreateUser} />} />
          <Route path='/login' element={<Login handleLogin={loginUser}/>} />
          <Route path='/users' element={<UserList />} />
        </Routes>
      </Router>
    </div>

  )
}

export default App
