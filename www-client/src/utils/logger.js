/* eslint-disable no-console */
const info = (...prms) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(...prms)
  }
}

const error = (...prms) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(...prms)
  }
}

export default {
  info,
  error,
}
