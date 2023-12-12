import React from 'react'
import { useNavigate } from 'react-router-dom'

import useCreateUser from '../../hooks/mutations/useCreateUser'
import CreateUserForm from '../forms/CreateUserForm'

import logger from '../../utils/logger'

const CreateUserPage = () => {
  const [createUser] = useCreateUser()
  const navigate = useNavigate()

  const handleCreate = async (data) => {
    logger.info('Create user input data:', data)
    const user = await createUser(data)
    logger.info('Create user on handlecreate, user object', user)
    if (user) {
      navigate('/')
    }
  }

  return <CreateUserForm handleCreate={handleCreate} />
}

export default CreateUserPage
