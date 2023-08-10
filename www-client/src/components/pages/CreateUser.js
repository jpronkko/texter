import React from 'react'
import { useDispatch } from 'react-redux'

import { logIn } from '../../app/userSlice'

import CreateUserForm from '../forms/CreateUserForm'
import useCreateUser from '../../hooks/useCreateUser'

import logger from '../../utils/logger'

const CreateUser = () => {
  const [createUser] = useCreateUser()
  const dispatch = useDispatch()

  const handleCreate = async (data) => {
    logger.info('Create user input data:', data)
    const user = await createUser(data)
    logger.info('foo on handlecreate', user)
    dispatch(logIn(data.username, data.password))
  }

  return (
    <CreateUserForm handleCreate={handleCreate} />
  )
}

export default CreateUser