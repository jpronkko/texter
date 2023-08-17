import { gql } from '@apollo/client'
import { USER_DETAILS } from './fragments'

export const USER_ADDED = gql`
  subscription {
    userAdded {
      name
    }
  }
  ${USER_DETAILS}
`

export const MESSAGE_ADDED = gql`
  subscription messageAdded($groupId: ID) {
    messageAdded(
      groupId: groupId
    ) {
      id
      sender
      body
    }
  }
`