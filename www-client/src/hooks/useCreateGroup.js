import { useMutation } from '@apollo/client'

import { CREATE_GROUP } from '../graphql/mutations'
import { GET_MY_INFO } from '../graphql/queries'

import logger from '../utils/logger'
import useError from './useErrorMessage'

/*
  update: (cache, response) => {
      cache.updateQuery({ query: ALL_PERSONS }, ({ allPersons }) => {
        return {
          allPersons: allPersons.concat(response.data.addPerson),
        }
      })
    },
*/

const useCreateGroup = () => {
  const [showError] = useError()
  const [mutation, result] = useMutation(CREATE_GROUP, {
    onError: (error) => {
      showError(error.toString())
    },
    /*update: (cache, response) => {
      cache.updateQuery({ query: GET_MY_INFO }, ({ me }) => {
        return {
          me: me.groups.concat(response.data.addGroup),
        }
      })
    },*/
    update: (store, response) => {
      const newGroup = response.data.createTopic
      const topicsInStore = store.readQuery({
        query: GET_TOPICS,
        variables: { groupId: newGroup.groupId },
      })
      store.writeQuery({
        query: GET_TOPICS,
        variables: { groupId: newGroup.groupId },
        data: {
          ...topicsInStore,
          getTopics: [...topicsInStore.getTopics, response.data.createTopic],
        },
      })
    }
  })

  const createGroup = async (name) => {
    logger.info('create group object:', name)
    const createResult = await mutation({ variables: { name } }) //var_object)
    logger.info('Create group result:', createResult)
    return createResult.data?.createGroup
  }

  return [createGroup, result]
}

export default useCreateGroup
