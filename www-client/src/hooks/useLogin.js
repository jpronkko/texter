import { useApolloClient, useMutation } from '@apollo/client'
import { LOGIN } from '../graphql/mutations'
import logger from '../utils/logger'

const useLogin = () => {
  const client = useApolloClient()
  const [loginMutation, result] = useMutation( LOGIN,
    {
      onError: (error) => {
        const err = error.toString()
        console.log('error', error)
        if(err.includes('Wrong credentials')) {
          throw new Error('Could not login, check your username and password! ')
        } else {
          throw new Error('Unknown error, check your network connection and try again.')
        }
      }
    }
  )

  const login = async (username, password) => {
    const var_object = { variables: { credentials: { username, password } } }
    logger.info('Login object', var_object)
    const loginResult = await loginMutation(var_object)

    const token = loginResult.data.login.token
    logger.info('Create user result:', )
    localStorage.setItem('texter', token)
    return loginResult.data.login.token
  }

  const logout = async () => {
    localStorage.clear()
    client.resetStore()
  }

  return [login, logout, result]
}

export default useLogin