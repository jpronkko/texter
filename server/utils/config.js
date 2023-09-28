require('dotenv').config()

const JWT_SECRET = process.env.SECRET
const PORT = process.env.PORT

let MONGODB_URI = process.env.DEV_MONGODB_URI
if (process.env.NODE_ENV === 'test') {
  MONGODB_URI = process.env.TEST_MONGODB_URI
} else if (process.env.NODE_ENV === 'production') {
  MONGODB_URI = process.env.PROD_MONGODB_URI
}

module.exports = {
  MONGODB_URI,
  PORT,
  JWT_SECRET
}