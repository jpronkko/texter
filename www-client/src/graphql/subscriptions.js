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
