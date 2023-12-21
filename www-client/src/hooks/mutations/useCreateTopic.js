import { useMutation } from '@apollo/client'

import { CREATE_TOPIC } from '../../graphql/mutations'
import { GET_TOPICS } from '../../graphql/queries'

import logger from '../../utils/logger'
import useError from '../ui/useErrorMessage'
import { uniqueById } from '../../utils/uniqById'
import { parseError } from '../../utils/parseError'

const useCreateTopic = () => {
  const [showError] = useError()
  const [mutation, result] = useMutation(CREATE_TOPIC, {
    onError: (error) => {
      showError(parseError(error))
      logger.error('create topic error:', error)
    },

    update: (cache, response) => {
      const newTopic = response.data.createTopic

      cache.updateQuery(
        { query: GET_TOPICS, variables: { groupId: newTopic.groupId } },
        ({ getTopics }) => {
          return {
            getTopics: uniqueById(getTopics.concat(newTopic)),
          }
        }
      )
    },
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
