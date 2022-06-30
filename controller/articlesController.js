const express = require('express')
const router = express.Router()
const Category = require('../models/Category')
const Article = require('../models/Article')
const slugify = require('slugify')

router.get('/admin/articles', (req, res) => {
	Article.findAll({
		include: [
			{
				model: Category
			}
		]
	}).then((articles) =>
		res.render('admin/articles/index', {
			articles
		})
	)
})

router.get('/admin/articles/new', (req, res) => {
	Category.findAll().then((categories) => {
		res.render('admin/articles/new', {
			categories
		})
	})
})

router.post('/admin/articles/save', (req, res) => {
	var title = req.body.title
	var body = req.body.body
	var categoryId = req.body.category
	if (title == undefined || title == '')
		return res.redirect('/admin/articles/new')

	Article.create({
		title,
		slug: slugify(title, {
			lower: true
		}),
		body,
		categoryId
	}).then(() => res.redirect('/admin/articles'))
})

router.post('/admin/articles/delete', (req, res) => {
	let id = req.body.id
	if (id == undefined) return res.redirect('/admin/articles')
	if (isNaN(id)) return res.redirect('/admin/articles')
	Article.destroy({
		where: {
			id
		}
	}).then(() => res.redirect('/admin/articles'))
})

router.get('/admin/articles/edit/:id', (req, res) => {
	let id = req.params.id
	if (isNaN(id)) return res.redirect('/admin/articles')
	Article.findByPk(id)
		.then((article) => {
			if (article == undefined) return res.redirect('/admin/articles')
			Category.findAll().then((categories) => {
				res.render('admin/articles/edit', {
					article,
					categories
				})
			})
		})
		.catch(() => res.redirect('/admin/articles'))
})

router.post('/admin/articles/update', (req, res) => {
	let id = req.body.id
	let title = req.body.title
	let body = req.body.body
	let categoryId = req.body.category
	if (id == undefined || isNaN(id)) return res.redirect('/admin/articles')
	if (title == undefined || title == '') return res.redirect('/admin/articles')
	if (body == undefined || body == '') return res.redirect('/admin/articles')
	Article.update(
		{
			title,
			slug: slugify(title, {
				lower: true
			}),
			body,
			categoryId
		},
		{
			where: {
				id
			}
		}
	).then(() => res.redirect('/admin/articles'))
})

router.get('/articles/page/:num', (req, res) => {
	let page = parseInt(req.params.num)
	let offset = 0
	if (page == undefined || isNaN(page)) {
		offset = 0
	} else {
		offset = (page - 1) * 4
	}
	Article.findAndCountAll({
		limit: 4,
		offset: offset,
		order: [['id', 'DESC']]
	}).then((articles) => {
		let next = true
		if (offset + 4 >= articles.count) next = false
		let result = {
			page,
			next,
			articles
		}
		Category.findAll().then((categories) => {
			res.render('admin/articles/page', {
				result,
				categories
			})
		})
	})
})

module.exports = router
