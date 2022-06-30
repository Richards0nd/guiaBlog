const Sequelize = require('sequelize')

const connection = new Sequelize('blog', 'local', 'local', {
	host: 'localhost',
	port: 3309,
	dialect: 'mariadb',
	timezone: '-03:00'
})

module.exports = connection
