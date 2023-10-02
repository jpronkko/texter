const jwt = require('jsonwebtoken')
const config = require('../utils/config')
const bcrypt = require('bcrypt')

const tokenFromUser = (user) => {
  console.log('token form user', user)
  return jwt.sign(
    { username: user.username, userId: user.id },
    config.JWT_SECRET
  )
}

const getHash = async (password) => {
  return await bcrypt.hash(password, 10)
}

const pwCompare = async (password, passwordHash) => {
  return await bcrypt.compare(password, passwordHash)
}

module.exports = {
  tokenFromUser,
  getHash,
  pwCompare,
}
