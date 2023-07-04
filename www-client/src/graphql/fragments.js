import { gql } from '@apollo/client'

export const USER_DETAILS = gql`
  fragment UserDetails on User {
    id
    username
    name
  }
`
