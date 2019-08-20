const JobServer = require('./server')
const path = require('path')

const env = process.env.NODE_ENV || 'development'
const dbConfig = require(path.join(__dirname, '/config.json'))[env]

const server = new JobServer({ dbConfig })

server.start()
