const mongoose = require('mongoose')
//mongoose.set('strictQuery', false)
const config = require('../utils/config')
const logger = require('../utils/logger')

logger.info('connecting to', config.MONGODB_URI)

let db = null
let disconnected = false

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const connect = async () => {
  await mongoose
    .connect(config.MONGODB_URI)
    .then((dbConnection) => {
      db = dbConnection
      logger.info('Connected to MongoDB.', config.MONGODB_URI)
    })
    .catch((error) => {
      logger.error('Error in connection to MongoDB:', error.message)
    })
}

const mongoConnect = async () => {
  while (!db && !disconnected) {
    logger.info('Waiting for MongoDB connection...')
    await connect()
    if (!db) {
      logger.error('MongoDB connection failed, retrying in 3 seconds...')
      await sleep(3000)
    }
  }
}

const mongoDisconnect = () => {
  //await mongoose.disconnect()
  //await mongoose.connection.close()
  if (db) {
    logger.info('Disconnecting from MongoDB!')
    db.disconnect()
    disconnected = true
  }
}

const mongoClearDb = async () => {
  const collections = mongoose.connection.collections

  await Promise.all(
    Object.values(collections).map(async (collection) => {
      await collection.deleteMany({}) // an empty mongodb selector object ({}) must be passed as the filter argument
    })
  )
}

module.exports = {
  mongoConnect,
  mongoDisconnect,
  mongoClearDb,
}
