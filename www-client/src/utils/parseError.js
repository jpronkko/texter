export const parseError = (error) => {
  if (error.graphQLErrors && error.graphQLErrors.length > 0) {
    console.log(error.graphQLErrors[0])
    return error.graphQLErrors.map((err) => err.message).join(',_ ')
  }
  return error.message
}
