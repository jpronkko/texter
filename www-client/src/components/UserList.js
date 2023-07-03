//import { useEffect, useState } from 'react';
import React from 'react'

import Button from '@mui/material/Button'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'

import { gql, useQuery, useSubscription } from '@apollo/client'
import logger from '../utils/logger'

const ALL_USERS_QUERY = gql`
{
  allUsers {
      name
      id
    }
}`

const USER_DETAILS = gql`
  fragment UserDetails on User {
    id
    username
    name
  }
`

const USER_ADDED = gql`
  subscription {
    userAdded {
      name
    }
  }
  ${USER_DETAILS}
`

const UserList = () => {
  //const [users, setUsers] = useState([])
  useSubscription(USER_ADDED, {
    onData: ({ data }) => {
      logger.info(data)
    }
  })

  const { loading, data, error, refetch } = useQuery(ALL_USERS_QUERY)

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