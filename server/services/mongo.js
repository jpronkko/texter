const mongoose = require('mongoose')
//mongoose.set('strictQuery', false)
const config = require('../utils/config')

console.log('connecting to', config.MONGODB_URI)

const mongoConnect = async () => {
  await mongoose.connect(config.MONGODB_URI)
    .then(() => {
      console.log('connected to MongoDB')
    })
    .catch((error) => {
      console.log('error in connection to MongoDB:', error.message)
    })
}

const mongoDisconnect = async () => {
  await mongoose.disconnect()
}

module.exports = {
  mongoConnect,
  mongoDisconnect
}