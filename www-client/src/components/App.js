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
import TopBar from './TopBar'

import { getLoginData } from '../utils/loginData'

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const loginData = getLoginData()
    if (loginData) {
      dispatch(logIn(loginData))
    }
  }, [])

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
            element={<CreateUserPage />}
          />
          <Route
            path="/login"
            element={<LoginPage />}
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
