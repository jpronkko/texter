import { gql } from '@apollo/client'

export const GET_ALL_USERS = gql`
  query GetAllUsers {
    allUsers {
      email
      id
      name
      username
      joinedGroups {
        groupId
        groupName
        role
      }
    }
  }
`

export const GET_USERS_NOT_IN_GROUP = gql`
  query GetUsersNotInGroup($groupId: ID!) {
    getUsersNotInGroup(groupId: $groupId) {
      email
      id
      name
      username
    }
  }
`

export const GET_ALL_GROUPS = gql`
  query GetAllGroups {
    allGroups {
      id
      ownerId
      name
    }
  }
`

export const GET_GROUP_MEMBERS = gql`
  query GetGroupMembers($groupId: ID!) {
    getGroupMembers(groupId: $groupId) {
      id
      name
      username
      email
      role
    }
  }
`

export const GET_ALL_MESSAGES = gql`
  query GetAllMessages {
    allMessages {
      id
      text
    }
  }
`

export const GET_USER_JOINED_GROUPS = gql`
  query GetUserJoinedGroups {
    getUserJoinedGroups {
      userId
      joinedGroups {
        groupId
        groupName
        description
        role
      }
    }
  }
`

export const GET_TOPICS = gql`
  query GetTopics($groupId: ID!) {
    getTopics(groupId: $groupId) {
      id
      groupId
      name
    }
  }
`

export const GET_MESSAGES = gql`
  query GetMessages($topicId: ID!) {
    getMessages(topicId: $topicId) {
      id
      topicId
      body
      sentTime
      fromUser {
        id
        name
      }
    }
  }
`

export const GET_SENT_INVITATIONS = gql`
  query GetSentInvitations {
    getSentInvitations {
      id
      sentTime
      status
      group {
        id
        name
        ownerId
      }
      fromUser {
        id
        name
        username
      }
      toUser {
        id
        name
        username
      }
    }
  }
`

export const GET_RECV_INVITATIONS = gql`
  query GetReceivedInvitations {
    getReceivedInvitations {
      id
      sentTime
      status
      group {
        id
        name
        ownerId
      }
      fromUser {
        id
        name
        username
      }
      toUser {
        id
        name
        username
      }
    }
  }
`
