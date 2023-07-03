const healthCheckRouter = require('express').Router()

healthCheckRouter.get('/', (req, res) => {
  res.send('ok')
})

module.exports = healthCheckRouter

