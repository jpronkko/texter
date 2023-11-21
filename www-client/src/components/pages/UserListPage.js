//import { useEffect, useState } from 'react';
import React from 'react'

import { Button, List, ListSubheader } from '@mui/material'
import UserListItem from '../UserListItem'

import { useQuery } from '@apollo/client'

import logger from '../../utils/logger'
import { GET_ALL_USERS } from '../../graphql/queries'

const UserList = () => {
  //const [users, setUsers] = useState([])
  /*useSubscription(USER_ADDED, {
    onData: ({ data }) => {
      logger.info(data)
    }
  })*/

  const { loading, data, error, refetch } = useQuery(GET_ALL_USERS)

  //console.log(JSON.stringify(data))
  /*useEffect(() => {

  }, [users])*/

  if (loading) {
    return <div>Loading ...</div>
  }

  if (error) {
    return <div>Error {JSON.stringify(error)}</div>
  }
  const handleClick = () => {
    logger.info('Trying refetch!')
    refetch()
  }
  const users = data.allUsers.map((user) => (
    <UserListItem
      key={user.id}
      user={user}
    />
  ))
  return (
    <div>
      <List
        subheader={
          <ListSubheader
            component="div"
            id="nested-list-subheader"
          >
            All users
          </ListSubheader>
        }
      >
        {users}
      </List>
      <Button
        variant="contained"
        onClick={handleClick}
      >
        Test refetch
      </Button>
    </div>
  )
}

export default UserList
