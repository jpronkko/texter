import { gql } from '@apollo/client'
import { USER_DETAILS } from './fragments'

export const USER_ADDED_TO_GROUP = gql`
  subscription userAddedToGroup($userId: ID!) {
    userAddedToGroup(userId: $userId) {
      user
      group
      role
    }
  }
  ${USER_DETAILS}
`

export const USER_REMOVED_FROM_GROUP = gql`
  subscription userRemovedFromGroup($userId: ID!) {
    userRemovedFromGroup(userId: $userId) {
      userId
      joinedGroups {
        description
        groupId
        groupName
        role
      }
    }
  }
`

export const TOPIC_ADDED_TO_GROUP = gql`
  subscription topicAddedToGroup($groupId: ID!) {
    topicAddedToGroup(groupId: $groupId) {
      id
      groupId
      name
    }
  }
`

export const TOPIC_REMOVED = gql`
  subscription topicRemoved($groupId: ID!) {
    topicRemoved(groupId: $groupId) {
      id
      groupId
      name
    }
  }
`

export const MESSAGE_ADDED_TO_TOPIC = gql`
  subscription messageAddedToTopic($topicId: ID!) {
    messageAddedToTopic(topicId: $topicId) {
      body
      fromUser {
        id
        name
      }
      id
      sentTime
      topicId
    }
  }
`

export const INVITATION_ADDED = gql`
  subscription invitationAdded($toUserId: ID!) {
    invitationAdded(toUserId: $toUserId) {
      id
      sentTime
      status
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
      toUser {
        id
        name
        username
      }
    }
  }
`

export const INVITATION_STATUS_CHANGED = gql`
  subscription invitationStatusChanged($userId: ID!) {
    invitationStatusChanged(userId: $userId) {
      id
      sentTime
      status
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
      toUser {
        id
        name
        username
      }
    }
  }
`
