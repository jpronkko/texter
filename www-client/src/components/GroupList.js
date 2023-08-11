import React from 'react'
import { useQuery } from '@apollo/client'

import { GET_ALL_USERS } from '../../graphql/queries'

const GroupList = () => {
  const { loading, data, error, refetch } = useQuery(GET_ALL_USERS)

  return (
    <div>
      GroupList

    </div>
  )
}

export default GroupList