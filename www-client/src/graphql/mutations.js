import { gql } from '@apollo/client'

export const CREATE_USER = gql`
  mutation createUser($user: UserInput) {
    createUser(user: $user) {
      token
      userId
      username
      email
      name
    }
  }
`

export const CREATE_GROUP = gql`
  mutation createGroup($name: String!) {
    createGroup(name: $name) {
      id
      name
      ownerId
    }
  }
`

// createTopic(groupId: ID!, name: String!): T
export const CREATE_TOPIC = gql`
  mutation createTopic($groupId: ID!, $name: String!) {
    createTopic(groupId: $groupId, name: $name) {
      id
      name
      groupId
    }
  }
`

export const CREATE_MESSAGE = gql`
  mutation createMessage($messageInput: MessageInput) {
    createMessage(messageInput: $messageInput) {
      id
      body
      sentTime
      fromUser {
        id
        name
      }
      topicId
    }
  }
`

export const LOGIN = gql`
  mutation login($credentials: UserLoginInput) {
    login(credentials: $credentials) {
      token
      email
      name
      userId
      username
    }
  }
`

export const CREATE_INVITATION = gql`
  mutation CreateInvitation($invitation: InvitationInput) {
    createInvitation(invitation: $invitation) {
      id
      groupId
      fromUserId
      toUserId
      status
      sentTime
    }
  }
`

export const CHANGE_INVITATION_STATUS = gql`
  mutation ChangeInvitationStatus(
    $invitationId: ID!
    $status: InvitationStatus!
  ) {
    changeInvitationStatus(id: $invitationId, status: $status) {
      id
      status
    }
  }
`
