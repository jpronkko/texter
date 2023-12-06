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

export const CHANGE_PASSWORD = gql`
  mutation changePassword($oldPassword: String!, $newPassword: String!) {
    changePassword(oldPassword: $oldPassword, newPassword: $newPassword) {
      id
    }
  }
`

export const CHANGE_EMAIL = gql`
  mutation changeEmail($password: String!, $newEmail: String!) {
    changeEmail(password: $password, newEmail: $newEmail) {
      id
    }
  }
`

export const CREATE_GROUP = gql`
  mutation createGroup($name: String!, $description: String!) {
    createGroup(name: $name, description: $description) {
      id
      name
      description
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
      fromUser {
        id
        name
        username
      }
      group {
        id
        name
        ownerId
      }
      id
      sentTime
      status
      toUser {
        id
        name
        username
      }
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

export const REMOVE_USER_FROM_GROUP = gql`
  mutation RemoveUserFromGroup($userId: ID!, $groupId: ID!) {
    removeUserFromGroup(userId: $userId, groupId: $groupId) {
      id
    }
  }
`
