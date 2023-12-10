import React from 'react'

import { Button, Container } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { PersonRemove } from '@mui/icons-material'
import SelectionPopup from './forms/SelectionPopup'

import useGetGroupMembers from '../hooks/queries/useGetGroupMembers'
import useUpdateUserRole from '../hooks/mutations/updateUserRole'
import useRemoveUserFromGroup from '../hooks/mutations/useRemoveUserFromGroup'

const GroupMembersTable = ({ groupId }) => {
  const { members, loading, error } = useGetGroupMembers(groupId)
  const [updateUserRole] = useUpdateUserRole()
  const [removeUserFromGroup] = useRemoveUserFromGroup()

  const handleUserRoleChange = async (userId, roleTitle) => {
    console.log('handleUserRoleChange', userId, roleTitle)
    const role = Object.keys(roleToTitle).find(
      (key) => roleToTitle[key] === roleTitle
    )
    console.log(Object.keys(roleToTitle), roleTitle, role)
    console.log('handleUserRoleChange', userId, groupId, role)
    await updateUserRole(userId, groupId, role)
  }

  const handleRemoveUserFromGroup = async (userId) => {
    console.log('handkeRemoveUserFromGroup', userId, groupId)
    await removeUserFromGroup(userId, groupId)
  }

  const roleToTitle = {
    ADMIN: 'Admin',
    MEMBER: 'Member',
    OWNER: 'Owner',
  }

  const columns = [
    { field: 'username', headerName: 'Username', width: 100 },
    {
      field: 'fullName',
      headerName: 'Full name',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 200,
    },
    { field: 'email', headerName: 'Email', width: 150 },
    {
      field: 'role',
      headerName: 'Role',
      width: 150,
      renderCell: (params) =>
        params.row.role === 'OWNER' ? (
          roleToTitle[params.row.role]
        ) : (
          <SelectionPopup
            defaultValue={roleToTitle[params.row.role]}
            selectionValues={[roleToTitle['ADMIN'], roleToTitle['MEMBER']]}
            handleSelectionChange={(value) =>
              handleUserRoleChange(params.row.id, value)
            }
          />
        ),
    },
    {
      field: 'remove',
      headerName: 'Remove',
      width: 200,
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="contained"
          disabled={params.row.role === 'OWNER'}
          onClick={() => handleRemoveUserFromGroup(params.row.id)}
        >
          <PersonRemove />
        </Button>
      ),
    },
  ]

  /* if (loading) {
    return <div>Loading...</div>
  }*/

  if (error) {
    return <div>Error: {error.message}</div>
  }

  const rows = members
    ? members.map((item) => ({
        id: item.id,
        username: item.username,
        fullName: item.name,
        email: item.email,
        role: item.role,
      }))
    : []

  return (
    <Container>
      {/*  <div style={{ height: 400, width: '100%' }}>
       */}{' '}
      <DataGrid
        rows={rows}
        columns={columns}
        onSelectionModelChange={(newSelection) => {
          console.log(newSelection)
          // Perform any desired actions with the selected rows
        }}
        loading={loading}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[10, 15]}
        footer
      />
      {/* </div> */}
    </Container>
  )
}

export default GroupMembersTable
