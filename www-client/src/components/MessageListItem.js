import React from 'react'

import { Divider, ListItemButton, Typography } from '@mui/material'


const pad = (number) => ('0' + number).slice(-2)

const getDate = (month, day) => {
  return `${pad(day)}/${pad(month)}`
}

const MessageListItem = ({ sender, sentTime, body, onClick }) => {
  const date = new Date(parseInt(sentTime))
  const dateNow = new Date(Date.now())

  const dayOfMonth = date.getDay()
  const month = date.getMonth()
  const year = date.getFullYear()

  const hrsMin = `${pad(date.getHours())}:${pad(date.getMinutes())}`
  let dateString = ` ${hrsMin}`

  if (year !== dateNow.getFullYear()) {
    dateString = year + getDate(month, dayOfMonth) + dateString
  }

  if (month !== dateNow.getMonth() ||
    dayOfMonth !== dateNow.getDay()) {
    dateString = getDate(month, dayOfMonth) + dateString
  }

  return(
    <div>
      <ListItemButton onClick={onClick}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'yellow',
            marginBottom: '2px',
            columnGap: '4px',
          }}>
            <Typography variant='h6'>Sender: {sender.name}</Typography>
            <Typography >{dateString}</Typography>
          </div>
          <div style={{ backgroundColor: 'green' }}>
            <Typography>{body}</Typography>
          </div>
        </div>
      </ListItemButton>
      <Divider />
    </div>
  )

}

export default MessageListItem