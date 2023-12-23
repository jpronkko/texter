/* eslint-disable no-console */
const info = (...prms) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(...prms)
  } else {
    console.log('Info:', ...prms)
  }
}

const error = (...prms) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(...prms)
  } else {
    console.error('Error:', ...prms)
  }
}

export default {
  info,
  error,
}
