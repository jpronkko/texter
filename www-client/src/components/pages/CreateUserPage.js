import React from 'react'
import { useNavigate } from 'react-router-dom'

import useCreateUser from '../../hooks/mutations/useCreateUser'
import CreateUserForm from '../forms/CreateUserForm'

const CreateUserPage = () => {
  const [createUser] = useCreateUser()
  const navigate = useNavigate()

  const handleCreate = async (data) => {
    const user = await createUser(data)
    if (user) {
      navigate('/')
    }
  }

  return <CreateUserForm handleCreate={handleCreate} />
}

export default CreateUserPage
