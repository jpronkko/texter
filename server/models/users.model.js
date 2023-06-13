const users = require('./users.mongo')

const findUser = async ( username ) => {
  return await users.findOne({ username })
}

const getAllUsers = async () => {
  return await users.find({}, { '__v': 0 })  
}

module.exports = {
  findUser,
  getAllUsers
}
