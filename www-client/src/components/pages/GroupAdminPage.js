import React from 'react'
import { useSelector } from 'react-redux'
import { Button, Container, Paper, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { PersonRemove, DoNotTouch } from '@mui/icons-material'

import useGetGroupMembers from '../../hooks/useGetGroupMembers'
import useGetTopics from '../../hooks/useGetTopics'

import SelectionPopup from '../forms/SelectionPopup'
import TitleBox from '../TitleBox'
import GroupForm from '../forms/GroupForm'

const GroupMembersTable = ({ groupId }) => {
  const { members, loading, error } = useGetGroupMembers(groupId)

  const columns = [
    { field: 'username', headerName: 'Username', width: 100 },
    {
      field: 'fullName',
      headerName: 'Full name',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 150,
      //valueGetter: (params) =>
      //  `${params.row.firstName || ''} ${params.row.lastName || ''}`,
    },
    { field: 'email', headerName: 'Email', width: 150 },
    {
      field: 'role',
      headerName: 'Role',
      width: 130,
      renderCell: (params) =>
        params.row.role === 'OWNER' ? (
          params.row.role
        ) : (
          <SelectionPopup
            defaultValue={params.row.role}
            selectionValues={['ADMIN', 'MEMBER']}
            handleSelectionChange={(value) => console.log(value)}
          />
        ),
    },
    /*  {
      field: 'status',
      headerName: 'Status',
      width: 130,
      //valueGetter: (params) => `${params.row.age || ''}`,
    }, */
    {
      field: 'remove',
      headerName: 'Remove',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="contained"
          disabled={params.row.role === 'OWNER'}
          onClick={() => console.log('Remove ', params.row.username)}
        >
          {params.row.role !== 'OWNER' ? <PersonRemove /> : <DoNotTouch />}
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
      <div style={{ height: 400, width: '100%' }}>
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
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
          footer
        />
      </div>
    </Container>
  )
}
const GroupItem = ({ topic }) => {
  return (
    <div style={{ flexDirection: 'row' }}>
      <Typography variant="h6">{topic.name}</Typography>
      <Button variant="contained">Remove Topic</Button>
    </div>
  )
}

const GroupAdminPage = () => {
  const group = useSelector((state) => state.selection.group)
  const { topics, error, loading } = useGetTopics(group?.id)
  console.log('group', group, 'topics', topics)

  if (error) {
    return <div>Error: {error.message}</div>
  }

  if (loading) {
    return <div>Loading...</div>
  }

  const handleFormSubmit = (data) => {
    console.log('Create group form submitted', data)
  }

  return (
    <Container>
      <TitleBox title={'Group Profile for ' + group.name} />
      <GroupForm handleFormSubmit={handleFormSubmit} />
      <TitleBox title={'Group Topics'}>
        <Button variant="contained">Add Topic</Button>
      </TitleBox>
      <Paper
        elevation={3}
        sx={{ p: 2 }}
      >
        {topics.map((item) => (
          <GroupItem
            key={item.id}
            topic={item}
          />
        ))}
      </Paper>
      <TitleBox title={'Group Members'}>
        <Button variant="contained">Add Member</Button>
      </TitleBox>
      <Paper elevation={3}>
        <GroupMembersTable groupId={group.id} />
      </Paper>
    </Container>
  )
}

export default GroupAdminPage
