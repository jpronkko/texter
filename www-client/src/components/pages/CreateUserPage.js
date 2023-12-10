import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { logIn } from '../../app/userSlice'
import useCreateUser from '../../hooks/mutations/useCreateUser'

import CreateUserForm from '../forms/CreateUserForm'

import logger from '../../utils/logger'

const CreateUserPage = () => {
  const [createUser] = useCreateUser()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleCreate = async (data) => {
    logger.info('Create user input data:', data)
    const user = await createUser(data)
    logger.info('Create user on handlecreate, user object', user)
    if (user) {
      dispatch(logIn(user))
      navigate('/')
    }
  }

  return <CreateUserForm handleCreate={handleCreate} />
}

export default CreateUserPage
