import { useQuery /* useSubscription */ } from '@apollo/client'

import { GET_MESSAGES } from '../../graphql/queries'
//import { MESSAGE_ADDED_TO_TOPIC } from '../graphql/subscriptions'

const useMessages = (topicId) => {
  const { data, error, loading, fetchMore, refetch, ...result } = useQuery(
    GET_MESSAGES,
    {
      variables: { topicId: topicId },
      skip: !topicId,
      fetchPolicy: 'cache-and-network',
    }
  )

  /* useSubscription(MESSAGE_ADDED_TO_TOPIC, {
    variables: {
      topicId: topicId,
    },
    onData: ({ data }) => {
      console.log(data)
    },
  }) */
  //console.log(`Repo id ${JSON.stringify(id)} data ${JSON.stringify(data)}`);

  const handleFetchMore = () => {
    /* const canFetchMore = !loading && data?.data.getMessages.pageInfo.hasNextPage;

    if(!canFetchMore) {
      return;
    }*/

    fetchMore({
      variables: {
        after: data.getMessages,
      },
    })
  }

  return {
    messages: data?.getMessages,
    fetchMore: handleFetchMore,
    loading,
    error,
    refetch,
    ...result,
  }
}

export default useMessages
