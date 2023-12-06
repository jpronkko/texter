import React, { useRef } from 'react'
import { useSelector } from 'react-redux'

import { Button, Container, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { PersonRemove, DoNotTouch } from '@mui/icons-material'

import useGetUsersNotInGroup from '../hooks/queries/useGetUsersNotInGroup'
import useModifySentInv from '../hooks/mutations/useModifySentInv'
import useSentInvitations from '../hooks/queries/useSentInvitations'

import ConfirmMessage from './dialogs/ConfirmMessage'

import { getDateFromString } from '../utils/parsedate'

const InvitationsTable = () => {
  const selectedGroup = useSelector((state) => state.selection.group)

  const { sentInvitations, /*error*/ loading } = useSentInvitations()
  const [cancelInvitation] = useModifySentInv()

  const { users, error: _error /*loading*/ } = useGetUsersNotInGroup(
    selectedGroup?.id
  )
  const groupInvitations = sentInvitations?.filter(
    (inv) => inv.group.id === selectedGroup.id
  )

  console.log('users', users, 'error', _error)

  let invitationToCancel = undefined

  const confirmDlgRef = useRef()

  const prepareCancelInvitation = (invitationId) => {
    invitationToCancel = invitationId
    confirmDlgRef.current.open()
  }

  const onCancelInvitation = async () => {
    console.log('cancelInvitation', invitationToCancel)
    const cancelledInvitation = await cancelInvitation(invitationToCancel.id)
    console.log('cancelledInvitation', cancelledInvitation)
    //confirmDlgRef.current.close()
  }

  const columns = [
    {
      field: 'username',
      headerName: 'Username',
      description: 'plopa',
      width: 150,
    },
    {
      field: 'status',
      headerName: 'Invitation status',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 200,
    },
    {
      field: 'sentTime',
      headerName: 'Sent time',
      width: 200,
      renderCell: (params) => (
        <Typography>{getDateFromString(params.row.sentTime)}</Typography>
      ),
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 200,
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="contained"
          disabled={params.row.status === Status['CANCELLED']}
          onClick={() => prepareCancelInvitation(params.id)}
        >
          {params.row.role !== 'OWNER' ? <PersonRemove /> : <DoNotTouch />}
        </Button>
      ),
    },
  ]

  const Status = {
    PENDING: 'Pending',
    ACCEPTED: 'Accepted',
    REJECTED: 'Rejected',
    CANCELLED: 'Cancelled',
  }

  const rows = groupInvitations
    ? groupInvitations.map((item) => ({
        id: item.id,
        username: item.toUser.username,
        status: Status[item.status],
        sentTime: item.sentTime,
      }))
    : []

  return (
    <Container>
      <ConfirmMessage
        ref={confirmDlgRef}
        title="Confirm"
        message="Are you sure you want to cancel this invitation?"
        onOk={onCancelInvitation}
      />
      {/* <div style={{ height: 400, width: '100%' }}> */}
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

export default InvitationsTable
