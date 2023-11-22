//* eslint-disable no-unused-vars */
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import { Toolbar } from '@mui/material'
import { logIn } from '../app/userSlice'

import CreateUserPage from './pages/CreateUserPage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import GroupAdminPage from './pages/GroupAdminPage'

import GroupSelectPage from './pages/GroupSelectPage'
import MessagesPage from './pages/MessagesPage'
import UserListPage from './pages/UserListPage'

import ErrorDlg from './dialogs/ErrorDlg'

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
        <ErrorDlg />
        <TopBar />
        <Toolbar />
        <Routes>
          <Route
            path="/"
            element={<GroupSelectPage />}
          />
          <Route
            path="/messages"
            element={<MessagesPage />}
          />
          <Route
            path="/group_admin"
            element={<GroupAdminPage />}
          />
          <Route
            path="/create_account"
            element={<CreateUserPage handleCreate={handleCreateUser} />}
          />
          <Route
            path="/login"
            element={<LoginPage handleLogin={loginUser} />}
          />
          <Route
            path="/users"
            element={<UserListPage />}
          />
          <Route
            path="/profile"
            element={<ProfilePage />}
          />
        </Routes>
      </Router>
    </div>
  )
}

export default App
