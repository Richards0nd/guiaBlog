const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcryptjs')

router.get('/admin/users', (req, res) => {
	User.findAll().then((users) => {
		res.render('admin/users/index', { users })
	})
})

router.get('/admin/users/create', (req, res) => {
	res.render('admin/users/create')
})

router.post('/admin/users/create', (req, res) => {
	let email = req.body.email
	let password = req.body.password

	User.findOne({ where: { email: email } }).then((user) => {
		if (user == undefined) {
			let salt = bcrypt.genSaltSync(10)
			password = bcrypt.hashSync(password, salt)
			User.create({
				email,
				password
			})
				.then(() => {
					res.redirect('/')
				})
				.catch((err) => {
					console.log(err)
					res.redirect('/')
				})
		} else return res.redirect('/')
	})
})

module.exports = router
