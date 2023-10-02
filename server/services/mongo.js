const mongoose = require('mongoose')
//mongoose.set('strictQuery', false)
const config = require('../utils/config')
const logger = require('../utils/logger')

console.log('connecting to', config.MONGODB_URI)

let db = null

const mongoConnect = () => {
  mongoose
    .connect(config.MONGODB_URI)
    .then((dbConnection) => {
      logger.info('Connected to MongoDB.')
      logger.info('Waiting connections...\n')
      db = dbConnection
    })
    .catch((error) => {
      console.log('Error in connection to MongoDB:', error.message)
    })
}

const mongoDisconnect = () => {
  //await mongoose.disconnect()
  //await mongoose.connection.close()
  if (db) {
    logger.info('Disconnecting from MongoDB!')
    db.disconnect()
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
