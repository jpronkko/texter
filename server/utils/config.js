require('dotenv').config()

const JWT_SECRET = process.env.SECRET
const PORT = process.env.PORT
const MONGODB_URI = process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development' ?
  process.env.TEST_MONGODB_URI :
  process.env.MONGODB_URI

module.exports = {
  MONGODB_URI,
  PORT,
  JWT_SECRET
}