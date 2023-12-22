import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CreateMessageForm from './CreateMessageForm'

const message = 'Chicken or egg?'

describe('Test CreateMessageForm rendering and input', () => {
  beforeEach(() => {})

  test('renders elements, clicking ok works', async () => {
    const handleCreateMock = jest.fn()
    const user = userEvent.setup()

    render(
      <CreateMessageForm
        title={message.title}
        message={message.message}
        handleCreate={handleCreateMock}
      />
    )
    const messageInput = screen.getByRole('textbox', { name: /^message/i })
    await user.type(messageInput, message)

    const okButton = screen.getByText('Submit')
    expect(okButton).toBeDefined()

    await user.click(okButton)

    expect(handleCreateMock.mock.calls).toHaveLength(1)
    expect(handleCreateMock.mock.calls[0][0]).toBe(message)
  })
})
