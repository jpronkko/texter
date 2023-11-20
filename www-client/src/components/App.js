//* eslint-disable no-unused-vars */
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import { Toolbar } from '@mui/material'
import { logIn } from '../app/userSlice'

import MainPage from './pages/MainPage'
import MessagesPage from './pages/MessagesPage'

import UserList from './pages/UserList'
import ErrorMessage from './ErrorMessage'

import CreateUser from './pages/CreateUser'
import Login from './pages/Login'
import Profile from './pages/Profile'
import GroupAmin from './pages/GroupAdmin'
import logger from '../utils/logger'
import TopBar from './TopBar'

const App = () => {
  const user = useSelector((state) => state.user.userData)
  const dispatch = useDispatch()

  useEffect(() => {
    const loginData = localStorage.getItem('texter-login')
    const loginDataAsObj = loginData ? JSON.parse(loginData) : null
    if (loginDataAsObj) {
      logger.info('App: setting login data', loginDataAsObj)
      dispatch(logIn(loginDataAsObj))
    }
  }, [])

  console.log('User now', user)

  const handleCreateUser = async (data) => {
    logger.info('Create user input data:', data)
  }

  const loginUser = async (data) => {
    logger.info('Login user input data:', data)
  }

  return (
    <div>
      <Router>
        <ErrorMessage />
        <TopBar />
        <Toolbar />
        <Routes>
          <Route
            path="/"
            element={<MainPage />}
          />
          <Route
            path="/messages"
            element={<MessagesPage />}
          />
          <Route
            path="/group_admin"
            element={<GroupAmin />}
          />
          <Route
            path="/create_account"
            element={<CreateUser handleCreate={handleCreateUser} />}
          />
          <Route
            path="/login"
            element={<Login handleLogin={loginUser} />}
          />
          <Route
            path="/users"
            element={<UserList />}
          />
          <Route
            path="/profile"
            element={<Profile />}
          />
        </Routes>
      </Router>
    </div>
  )
}

export default App
