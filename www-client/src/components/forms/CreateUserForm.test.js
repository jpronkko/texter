import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import CreateUserForm from './CreateUserForm'
import userEvent from '@testing-library/user-event'
import * as router from 'react-router'

const navigate = jest.fn()

const userData = {
  name: 'Ilari Lyhtypilari',
  username: 'ilari',
  email: 'ilari@pilari.com',
  password: 'secret123',
}

describe('Test CreateUserForm rendering and input', () => {
  beforeEach(() => {
    jest.spyOn(router, 'useNavigate').mockImplementation(() => navigate)
  })

  test('renders elements', async () => {
    render(<CreateUserForm />)
    const nameInput = screen.getByRole('textbox', { name: /^name/i })
    expect(nameInput).toBeDefined()

    const usernameInput = screen.getByRole('textbox', { name: /username/i })
    expect(usernameInput).toBeDefined()

    const emailInput = screen.getByRole('textbox', { name: /mail/i })
    expect(emailInput).toBeDefined()

    const passwordInput = screen.getByTestId('password')
    expect(passwordInput).toBeDefined()

    const submitButton = screen.getByText('Create')
    expect(submitButton).toBeDefined()
  })

  test('calls handleCreate with right parameters', async () => {
    const onSubmitMock = jest.fn()
    const user = userEvent.setup()

    render(<CreateUserForm handleCreate={onSubmitMock} />)
    const nameInput = screen.getByRole('textbox', { name: /^name/i })
    await user.type(nameInput, userData.name)

    const usernameInput = screen.getByRole('textbox', { name: /username/i })
    await user.type(usernameInput, userData.username)

    const emailInput = screen.getByRole('textbox', { name: /mail/i })
    await user.type(emailInput, userData.email)

    const passwordInput = screen.getByTestId('password')
    await user.type(passwordInput, userData.password)

    const submitButton = screen.getByText('Create')
    await user.click(submitButton)

    expect(onSubmitMock.mock.calls).toHaveLength(1)
    expect(onSubmitMock).toHaveBeenCalledWith(userData)
  })
})
