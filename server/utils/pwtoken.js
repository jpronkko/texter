const jwt = require('jsonwebtoken')
const config = require('../utils/config')
const bcrypt = require('bcrypt')

const tokenFromUser = (user) => {
  return(
    { token: jwt.sign( { username: user.name, id: user._id }, config.JWT_SECRET) }
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