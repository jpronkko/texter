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

  // return (
  //   <div>
  //     <Router>

  //       <Box sx={{ flexGrow: 1 }}>
  //         <Grid container>
  //           <ErrorMessage />
  //           <ConfirmMessage />
  //           <Grid xs={12}>
  //             <TopBar />
  //           </Grid>
  //           <Grid xs={2}>
  //             <GroupList />
  //           </Grid>
  //           <Grid xs={9}>
  //             <p>{ userLoggedIn() ? `user logged in ${user.username}` : 'user logged out' }</p>
  //             <Button onClick={() => showMessage('jddj', 'kgfjgj')}>Click</Button>
  //             <div>
  //               <Link style={padding} to='/'>home</Link>
  //               <Link style={padding} to='/users'>Users</Link>
  //               <Link style={padding} to='/create_account'>Create Account</Link>
  //             </div>
  //           </Grid>
  //         </Grid>
  //       </Box>

  //       <Routes>
  //         <Route path='/' element={<MainPage />} />
  //         <Route path='/login' element={<Login handleLogin={loginUser}/>} />
  //         <Route path='/groups' element={<GroupList />} />
  //         <Route path='/users' element={<UserList />} />
  //         <Route path='/create_account' element={<CreateUser handleCreate={handleCreateUser} />} />
  //       </Routes>
  //     </Router>
  //   </div>
  // )
  // return (
  //   <Box sx={{ minWidth: '100%', height: '100vh', backgroundColor: 'yellow' }} >
  //     <Grid container spacing={2}>
  //       <Grid xs={12}>
  //         <Box sx={{ bgcolor: 'blue' }}>
  //         Vittu
  //         </Box>
  //       </Grid>
  //       <Grid xs={3}>
  //         <Box sx={{ bgcolor: 'green' }}>

  //           <Box sx={{ bgcolor: 'blue' }}>
  //             Vittu 2
  //           </Box>
  //           <Box sx={{ bgcolor: 'blue' }}>
  //             Vittu 3
  //           </Box>
  //         </Box>
  //       </Grid>
  //       <Grid container xs={9}>
  //         <Grid xs={4}>
  //           <Item>xs=8</Item>
  //         </Grid>
  //         <Grid xs={4}>
  //           <Item>xs=4</Item>
  //         </Grid>
  //         <Grid xs={2}>
  //           <Item>xs=4</Item>
  //         </Grid>
  //         <Grid xs={6}>
  //           <Item>xs=8</Item>
  //         </Grid>
  //       </Grid>
  //     </Grid>
  //   </Box>
  // )
  /*return(
    <div>
      <Grid>
        <Grid item xs={1}>
          <Box sx={{ backgroundColor: 'blue' }}>
            Karahvi
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box sx={{ backgroundColor: 'yellow' }}>
            Perti
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box sx={{ backgroundColor: 'pink' }}>
            Narahvi
          </Box>
        </Grid>
      </Grid>
    </div>
  )*/
}

export default App

/*
return (
    <div>
      <Router>
        <Box sx={{ flexGrow: 1 }}>
          <Grid>
            <ErrorMessage />
            <ConfirmMessage />
            <Grid xs={12}>
              <TopBar />
              </Grid>
              <Grid xs={4}>
                <GroupList />
              </Grid>
              <Grid xs={8}>
                <p>{ userLoggedIn() ? `user logged in ${user.username}` : 'user logged out' }</p>
                <Button onClick={() => showMessage('jddj', 'kgfjgj')}>Click</Button>
                <div>
                  <Link style={padding} to='/'>home</Link>
                  <Link style={padding} to='/users'>Users</Link>
                  <Link style={padding} to='/create_account'>Create Account</Link>
                </div>
              </Grid>
            </Grid>
          </Box>

          <Routes>
            <Route path='/' element={<MainPage />} />
            <Route path='/login' element={<Login handleLogin={loginUser}/>} />
            <Route path='/groups' element={<GroupList />} />
            <Route path='/users' element={<UserList />} />
            <Route path='/create_account' element={<CreateUser handleCreate={handleCreateUser} />} />
          </Routes>
        </Router>
      </div>
      */