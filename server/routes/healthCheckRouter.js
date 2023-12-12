const healthCheckRouter = require('express').Router()

healthCheckRouter.get('/', (req, res) => {
  res.sendStatus(200)
})

module.exports = healthCheckRouter
