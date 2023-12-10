export const parseError = (error) => {
  if (error.graphQLErrors) {
    console.log(error.graphQLErrors[0])
    return error.graphQLErrors[0].message
  }
  return error.message
}
