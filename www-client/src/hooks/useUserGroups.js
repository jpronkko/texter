import { useQuery } from '@apollo/client';

import { GET_USER_JOINED_GROUPS } from '../graphql/queries';

const useUserGroups = (id) => {
  const { data, error, loading, refetch, ...result } = 
    useQuery(GET_USER_JOINED_GROUPS, {
      //variables: { first, repositoryId: id},
      skip: id ? false: true,
      fetchPolicy: 'cache-and-network', 
    });

  return { 
    repository: data?.group, 
    loading, 
    error,  
    refetch,
    ...result,
  };
};

export default useUserGroups;
