/* eslint-disable no-console */
const info = (...prms) => {
  console.log(...prms)
}

const error = (...prms) => {
  console.error(...prms)
}

/* eslint-enable no-console */

export default {
  info, error
}