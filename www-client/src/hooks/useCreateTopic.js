import { useMutation } from '@apollo/client'

import { CREATE_TOPIC } from '../graphql/mutations'
import { GET_TOPICS } from '../graphql/queries'

import logger from '../utils/logger'
//import useError from './useErrorMessage'

const useCreateTopic = () => {
  //const [showError] = useError()
  const [mutation, result] = useMutation(CREATE_TOPIC, {
    /*onError: (error) => {
      showError(error.toString())
    },*/
    update: (store, response) => {
      const newTopic = response.data.createTopic
      const topicsInStore = store.readQuery({
        query: GET_TOPICS,
        variables: { groupId: newTopic.groupId },
      })
      console.log('ntopic', newTopic, topicsInStore)
      store.writeQuery({
        query: GET_TOPICS,
        variables: { groupId: newTopic.groupId },
        data: {
          ...topicsInStore,
          getTopics: [...topicsInStore.getTopics, newTopic],
        },
      })
    },
    //refetchQueries: [{ query: GET_TOPICS }],
    /*update: (cache, response) => {
      cache.updateQuery({ query: GET_TOPICS }, ({ getTopics }) => {
        //console.log('updating', response)
        return {
          getTopics: getTopics.concat(response.data.createTopic),
        }
      })
    },*/
  })

  const createTopic = async (groupId, name) => {
    logger.info('createTopic:', groupId, name)
    const createResult = await mutation({ variables: { groupId, name } })
    logger.info('Create topic result:', createResult)
    return createResult.data?.createTopic
  }

  return [createTopic, result]
}

export default useCreateTopic
