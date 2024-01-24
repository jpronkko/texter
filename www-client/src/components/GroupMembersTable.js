import React, { useRef } from 'react'

import { Button, Container } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { PersonRemove } from '@mui/icons-material'
import SelectionPopup from './forms/SelectionPopup'

import ConfirmMessage from './dialogs/ConfirmMessage'

import useGetGroupMembers from '../hooks/queries/useGetGroupMembers'
import useUpdateUserRole from '../hooks/mutations/useUpdateUserRole'
import useRemoveUserFromGroup from '../hooks/mutations/useRemoveUserFromGroup'

const GroupMembersTable = ({ groupId }) => {
  const { members, loading } = useGetGroupMembers(groupId)
  const [updateUserRole] = useUpdateUserRole()
  const [removeUserFromGroup] = useRemoveUserFromGroup()

  const handleUserRoleChange = async (userId, roleTitle) => {
    const role = Object.keys(roleToTitle).find(
      (key) => roleToTitle[key] === roleTitle
    )
    await updateUserRole(userId, groupId, role)
  }

  const confirmDlgRef = useRef()

  const preapreRemoveUserFromGroup = (userId, username) => {
    confirmDlgRef.current.open({ userId, username })
  }

  const onRemoveUser = async (okObject) => {
    await removeUserFromGroup(okObject.userId, groupId)
  }

  const roleToTitle = {
    OWNER: 'Owner',
    ADMIN: 'Admin',
    MEMBER: 'Member',
  }

  const roleComparator = (role1, role2) => {
    const role1Index = Object.keys(roleToTitle).findIndex(
      (key) => key === role1
    )
    const role2Index = Object.keys(roleToTitle).findIndex(
      (key) => key === role2
    )
    return role1Index - role2Index
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
      sortComparator: roleComparator,
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
          id="remove-user-button"
          variant="contained"
          disabled={params.row.role === 'OWNER'}
          onClick={() =>
            preapreRemoveUserFromGroup(params.row.id, params.row.username)
          }
        >
          <PersonRemove />
        </Button>
      ),
    },
  ]

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
    <Container
      id="group-members-table"
      sx={{ minHeight: 225 }}
    >
      <ConfirmMessage
        ref={confirmDlgRef}
        title="Confirm"
        message="Are you sure you want to remove user?"
        onOk={onRemoveUser}
      />
      <DataGrid
        rows={rows}
        columns={columns}
        minHeight={300}
        loading={loading}
        initialState={{
          sorting: {
            sortModel: [
              {
                field: 'role',
                sort: 'asc',
              },
            ],
          },
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[10, 15]}
        footer
      />
    </Container>
  )
}

export default GroupMembersTable
