import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'

import { Toolbar } from '@mui/material'

import { logIn } from '../app/userSlice'

import CreateUserPage from './pages/CreateUserPage'
import LoginPage from './pages/LoginPage'
import GroupAdminPage from './pages/GroupAdminPage'
import ErrorDlg from './dialogs/ErrorDlg'
import GroupSelectPage from './pages/GroupSelectPage'
import MessagesPage from './pages/MessagesPage'
import UserListPage from './pages/UserListPage'
import TopBar from './TopBar'

import { getLoginData } from '../utils/loginData'
import logger from '../utils/logger'

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const loginData = getLoginData()
    if (loginData) {
      logger.info('App: setting login data', loginData)
      dispatch(logIn(loginData))
    }
  }, [])

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
            path="*"
            element={<Navigate to="/" />}
          />
        </Routes>
      </Router>
    </div>
  )
}

export default App
