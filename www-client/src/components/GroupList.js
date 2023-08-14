//import { useEffect, useState } from 'react';
import React from 'react'

import { Button, List, Typography } from '@mui/material'

import { useQuery, /*useSubscription*/ } from '@apollo/client'

import logger from '../utils/logger'
//import { USER_ADDED } from '../../graphql/subscriptions'
import { GET_ALL_GROUPS } from '../graphql/queries'


const GroupList = () => {
  //const [users, setUsers] = useState([])
  /*useSubscription(USER_ADDED, {
    onData: ({ data }) => {
      logger.info(data)
    }
  })*/

  const { loading, data, error, refetch } = useQuery(GET_ALL_GROUPS)

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
  const groups = data.allGroups.map((group) => <Typography  key={group.id} >{group.name}</Typography>)
  return (
    <div>
      <List>
        {groups}
      </List>
      <Button variant="contained" onClick={handleClick}>Test refetch</Button>
    </div>
  )
}

export default GroupList