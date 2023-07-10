/* eslint-disable no-console */
const info = (...prms) => {
  console.log(...prms)
}

const error = (...prms) => {
  console.error(...prms)
}

const debug = (...prms) => {
  console.debug(...prms)
}
/* eslint-enable no-console */

module.exports = {
  info, error, debug
}