const mongoose = require('mongoose')
//mongoose.set('strictQuery', false)
const config = require('../utils/config')

console.log('connecting to', config.MONGODB_URI)

let db=null

const mongoConnect = () => {
  mongoose.connect(config.MONGODB_URI)
    .then((dbConnection) => {
      console.log('connected to MongoDB')
      db=dbConnection
    })
    .catch((error) => {
      console.log('error in connection to MongoDB:', error.message)
    })
}

const mongoDisconnect = () => {
  //await mongoose.disconnect()
  //await mongoose.connection.close()
  if(db)
    db.disconnect()
}

module.exports = {
  mongoConnect,
  mongoDisconnect
}