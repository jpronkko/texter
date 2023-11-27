require('dotenv').config()

const JWT_SECRET = process.env.SECRET
const PORT = process.env.PORT
const MIN_PASSWORD_LENGTH = 10

let MONGODB_URI = process.env.DEV_MONGODB_URI
console.log(`ENV is ${process.env.NODE_ENV}`)

if (process.env.NODE_ENV === 'test') {
  MONGODB_URI = process.env.TEST_MONGODB_URI
} else if (process.env.NODE_ENV === 'production') {
  MONGODB_URI = process.env.PROD_MONGODB_URI
}

module.exports = {
  MIN_PASSWORD_LENGTH,
  MONGODB_URI,
  PORT,
  JWT_SECRET,
}
