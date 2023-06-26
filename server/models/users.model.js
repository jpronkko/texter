const User = require('./users.mongo')

const findUser = async (username) => {
  return await User.findOne({ username })
}

const getAllUsers = async () => {
  return await User.find({}, { '__v': 0 })
}

const createUser = async (name, username, password) => {
  const user = new User({ name, username, password })
  return await user.save()
}

module.exports = {
  findUser,
  getAllUsers,
  createUser,
}
