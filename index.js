const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const connection = require('./database/database')

const categoriesController = require('./controller/categoriesController')
const articlesController = require('./controller/articlesController')
const usersController = require('./controller/usersController')

// Database connection
connection
	.authenticate()
	.then(() =>
		console.log('Conexão com o bando de dados realizada com sucesso')
	)
	.catch((err) => {
		console.log(err)
	})

const Article = require('./models/Article')
const Category = require('./models/Category')
const User = require('./models/User')

// Settings view engine EJS
app.set('view engine', 'ejs')
app.use(express.static('public'))

// Use BodyParser in express
app.use(
	bodyParser.urlencoded({
		extended: false
	})
)
app.use(bodyParser.json())

app.use('/', categoriesController)
app.use('/', articlesController)
app.use('/', usersController)

app.use('/admin', (req, res) => {
	res.render('admin/index')
})

app.get('/', (req, res) => {
	Article.findAll({
		order: [['id', 'DESC']],
		limit: 4
	}).then((articles) => {
		Category.findAll().then((categories) => {
			res.render('index', {
				articles,
				categories
			})
		})
	})
})

app.get('/:slug', (req, res) => {
	var slug = req.params.slug
	Article.findOne({
		where: {
			slug: slug
		}
	})
		.then((article) => {
			if (article == undefined) return res.redirect('/')
			Category.findAll().then((categories) => {
				res.render('article', {
					article,
					categories
				})
			})
		})
		.catch(() => res.redirect('/'))
})

app.get('/category/:slug', (req, res) => {
	var slug = req.params.slug
	Category.findOne({
		where: {
			slug
		},
		include: [
			{
				model: Article
			}
		]
	})
		.then((category) => {
			if (category == undefined) return res.redirect('/')
			Category.findAll().then((categories) => {
				res.render('index', {
					articles: category.articles,
					categories
				})
			})
		})
		.catch(() => res.redirect('/'))
})

app.listen(80, () => {
	console.log('Servidor iniciado')
})
