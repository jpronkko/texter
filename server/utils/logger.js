/* eslint-disable no-console */
const info = (...prms) => {
  console.log('-------------------------------------------------------------')
  console.log(...prms)
}

const error = (...prms) => {
  console.log('-------------------------------------------------------------')
  console.error(...prms)
}

const debug = (...prms) => {
  console.log('-------------------------------------------------------------')
  console.debug(...prms)
}
/* eslint-enable no-console */

module.exports = {
  info,
  error,
  debug,
}
