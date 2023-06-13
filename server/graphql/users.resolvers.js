const usersModel = require('../models/users.model')

module.exports = {
  Query: {
    allUsers: () => usersModel.getAllUsers(),
    findUser: (root, args) => 
      usersModel.findUser(args.username)
  }
}