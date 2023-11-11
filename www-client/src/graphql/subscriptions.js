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

export const TOPIC_ADDED_TO_GROUP = gql`
  subscription topicAddedToGroup($groupId: ID!) {
    topicAddedToGroup(groupId: groupId) {
      id
      groupId
      name
    }
  }
`

export const MESSAGE_ADDED_TO_TOPIC = gql`
  subscription messageAddedToTopic($topicId: ID!) {
    messageAddedToTopic(topicId: topicId) {
      message {
        body
        fromUser
        id
        sentTime
      }
      topicId
    }
  }
`

export const INVITATION_ADDED = gql`
  subscription messageAdded($groupId: ID!) {
    invitationAdded(toUserId: $toUserId) {
      fromUserId
      groupId
      id
      sentTime
      status
    }
  }
`
