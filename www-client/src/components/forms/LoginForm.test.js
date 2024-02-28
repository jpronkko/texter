import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as router from 'react-router'

import LoginForm from './LoginForm'

describe('LoginForm', () => {
  const navigate = jest.fn()
  const handleLoginMock = jest.fn()

  beforeEach(() => {
    navigate.mockClear()
    handleLoginMock.mockClear()

    jest.spyOn(router, 'useNavigate').mockImplementation(() => navigate)
    render(<LoginForm handleLogin={handleLoginMock} />)
  })
  test('renders login form correctly', () => {
    expect(screen.getByLabelText('Username')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()

    expect(screen.getByText('Login')).toBeDefined()
    expect(screen.getByText('Create a New Account')).toBeDefined()
  })

  test('calls handleLogin with form data on submit', async () => {
    const user = userEvent.setup()

    // Fill in the form inputs
    const usernameInput = screen.getByLabelText('Username')
    await user.type(usernameInput, 'testuser')

    const passwordInput = screen.getByLabelText('Password')
    await user.type(passwordInput, 'testpassword')

    const submitButton = screen.getByText('Login')
    await user.click(submitButton)

    // Check if handleLogin is called with the correct data
    expect(handleLoginMock).toHaveBeenCalledWith({
      username: 'testuser',
      password: 'testpassword',
    })
  })
})
