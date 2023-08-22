import React from 'react'
import { useDispatch } from 'react-redux'

import { logIn } from '../../app/userSlice'

import CreateUserForm from '../forms/CreateUserForm'
import useCreateUser from '../../hooks/useCreateUser'

import logger from '../../utils/logger'
import { useNavigate } from 'react-router-dom'

const CreateUser = () => {
  const [createUser] = useCreateUser()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleCreate = async (data) => {
    logger.info('Create user input data:', data)
    const user = await createUser(data)
    logger.info('Create user on handlecreate, user object', user)
    dispatch(logIn(user))
    navigate('/')
  }

  return (
    <CreateUserForm handleCreate={handleCreate} />
  )
}

export default CreateUser