export const setLoginData = (data) => {
  localStorage.setItem('texter-login', JSON.stringify(data))
  localStorage.setItem('texter-token', data.token)
}

export const getStoredToken = () => {
  return localStorage.getItem('texter-token')
}

export const getLoginData = () => {
  const loginData = localStorage.getItem('texter-login')
  const loginDataAsObj = loginData ? JSON.parse(loginData) : null
  return loginDataAsObj
}

//export default { getLoginData, getStoredToken, setLoginData }
