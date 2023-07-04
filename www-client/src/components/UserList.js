//import { useEffect, useState } from 'react';
import React from 'react'

import Button from '@mui/material/Button'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'

import { useQuery, useSubscription } from '@apollo/client'

import logger from '../utils/logger'
import { USER_ADDED } from '../graphql/subscriptions'
import { GET_ALL_USERS } from '../graphql/queries'


const UserList = () => {
  //const [users, setUsers] = useState([])
  useSubscription(USER_ADDED, {
    onData: ({ data }) => {
      logger.info(data)
    }
  })

  const { loading, data, error, refetch } = useQuery(GET_ALL_USERS)

  //console.log(JSON.stringify(data))
  /*useEffect(() => {

  }, [users])*/

  if(loading) {
    return (
      <div>
        Loading ...
      </div>
    )
  }

  if(error) {
    return (
      <div>
        Error {JSON.stringify(error)}
      </div>
    )
  }
  const handleClick = () => {
    logger.info('Trying refetch!')
    refetch()
  }
  const users = data.allUsers.map((user) => <ListItem  key={user.id}>{user.name}</ListItem>)
  return (
    <div>
      <List>
        {users}
      </List>
      <Button variant="contained" onClick={handleClick}>Test refetch</Button>
    </div>
  )
}

export default UserList