import React, { useRef } from 'react'
import { useSelector } from 'react-redux'

import { Button, Container, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { PersonRemove, DoNotTouch } from '@mui/icons-material'

import useModifySentInv from '../hooks/mutations/useModifySentInv'
import useSentInvitations from '../hooks/queries/useSentInvitations'

import ConfirmMessage from './dialogs/ConfirmMessage'

import { getDateFromString } from '../utils/parsedate'

const InvitationsTable = () => {
  const selectedGroup = useSelector((state) => state.selection.group)

  const { sentInvitations, loading } = useSentInvitations()
  const [cancelInvitation] = useModifySentInv()

  const groupInvitations = sentInvitations?.filter(
    (inv) => inv.group.id === selectedGroup.id && inv.status !== 'ACCEPTED'
  )

  let invitationToCancel = undefined

  const confirmDlgRef = useRef()

  const prepareCancelInvitation = (invitationId) => {
    invitationToCancel = invitationId
    confirmDlgRef.current.open()
  }

  const onCancelInvitation = async () => {
    await cancelInvitation(invitationToCancel)
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
          disabled={
            params.row.status === Status['CANCELLED'] ||
            params.row.status === Status['ACCEPTED']
          }
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

  const renderRows = () => {
    if (rows.length === 0) {
      return <Typography variant="h6">No Invitations</Typography>
    } else {
      return (
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[10, 15]}
          footer
        />
      )
    }
  }

  return (
    <Container>
      <ConfirmMessage
        ref={confirmDlgRef}
        title="Confirm"
        message="Are you sure you want to cancel this invitation?"
        onOk={onCancelInvitation}
      />
      {renderRows()}
    </Container>
  )
}

export default InvitationsTable
