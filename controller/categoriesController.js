const express = require('express')
const router = express.Router()
const Category = require('../models/Category')
const slugify = require('slugify')


router.get('/admin/categories', (req, res) => {
	Category.findAll().then(categories => {
		res.render('admin/categories/index', {
			categories
		})
	})
})

router.get('/admin/categories/new', (req, res) => {
	res.render('admin/categories/new')
})

router.post('/admin/categories/save', (req, res) => {
	let title = req.body.title
	if (title == undefined) return res.render('admin/categories/new')
	Category.create({
		title,
		slug: slugify(title, {
			lower: true
		}),
	}).then(() => res.redirect('/admin/categories'))
})


router.post('/admin/categories/delete', (req, res) => {
	let id = req.body.id
	if (id == undefined) return res.redirect('/admin/categories')
	if (isNaN(id)) return res.redirect('/admin/categories')
	Category.destroy({
		where: {
			id
		}
	}).then(() => res.redirect('/admin/categories'))
})

router.get('/admin/categories/edit/:id', (req, res) => {
	let id = req.params.id
	if (isNaN(id)) return res.redirect('/admin/categories')
	Category.findByPk(id).then(category => {
		if (category == undefined) return res.redirect('/admin/categories')
		res.render('admin/categories/edit', {
			category
		})
	}).catch(() => res.redirect('/admin/categories'))
})

router.post('/admin/categories/update', (req, res) => {
	let id = req.body.id
	let title = req.body.title
	if (id == undefined) return res.redirect('/admin/categories')
	if (title == undefined) return res.redirect('/admin/categories')
	if (isNaN(id)) return res.redirect('/admin/categories')
	Category.update({
		title,
		slug: slugify(title, {
			lower: true
		})
	}, {
		where: {
			id
		}
	}).then(() => res.redirect('/admin/categories'))
})

module.exports = router