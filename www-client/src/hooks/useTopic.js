import { useQuery } from '@apollo/client';

import { GET_TOPIC } from '../graphql/queries';

const useTopic = (first, id) => {
  const { data, error, loading, fetchMore, refetch, ...result } = 
    useQuery(GET_REPOSITORY, {
      variables: { first, repositoryId: id},  
      fetchPolicy: 'cache-and-network', 
    });

  //console.log(`Repo id ${JSON.stringify(id)} data ${JSON.stringify(data)}`);

  const handleFetchMore = () => {
    const canFetchMore = !loading && data?.repository.reviews.pageInfo.hasNextPage;
    
    if(!canFetchMore) {
      return;
    }

    fetchMore({
      variables: {
        after: data.repository.reviews.pageInfo.endCursor,
      }
    });
  };   

  return { 
    repository: data?.repository, 
    fetchMore: handleFetchMore,
    loading, 
    error,  
    refetch,
    ...result,
  };
};

export default useTopic;
