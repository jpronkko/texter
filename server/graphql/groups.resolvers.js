const groupsModel = require('../models/groups.model')
const logger = require('../utils/logger')
const { checkUser } = require('../utils/checkUser')

module.exports = {
  Query: {
    allGroups: async () => {
      return await groupsModel.getAllGroups()
    },
  },
  Mutation: {
    createGroup: async (root, args, { currentUser }) => {
      logger.info('Creating a group', args)

      checkUser(currentUser, 'Creating a group failed!')

      const { name } = args

      const newGroup = await groupsModel.createGroup(
        currentUser,
        name
      )
      return {
        id: newGroup.id,
        name: newGroup.name,
        ownerId: newGroup.ownerId
      }
    },
  },
}