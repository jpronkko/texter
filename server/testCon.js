require('dotenv').config()
const logger = require('./logger')

const JWT_SECRET = process.env.SECRET
const PORT = process.env.PORT
const MIN_PASSWORD_LENGTH = 8

logger.info(
  `ENV is ${process.env.NODE_ENV} ${JWT_SECRET} ${PORT} ${MIN_PASSWORD_LENGTH}`
)

let MONGODB_URI = process.env.DEV_MONGODB_URI

if (process.env.NODE_ENV === 'test') {
  MONGODB_URI = process.env.TEST_MONGODB_URI
} else if (process.env.NODE_ENV === 'production') {
  MONGODB_URI = process.env.PROD_MONGODB_URI
}

logger.info(`MONGODB_URI is ${MONGODB_URI}`)
