const express = require('express')
const app = express()
const session = require('express-session')
const connection = require('./database/database')

const categoriesController = require('./controller/categoriesController')
const articlesController = require('./controller/articlesController')
const usersController = require('./controller/usersController')

// Database connection
connection
	.authenticate()
	.then(() => console.log('Conexão com o bando de dados realizada com sucesso'))
	.catch((err) => {
		console.log(err)
	})

const Article = require('./models/Article')
const Category = require('./models/Category')
const User = require('./models/User')

// Settings view engine EJS
app.set('view engine', 'ejs')
app.use(express.static('public'))

// Sessions
app.use(
	session({
		secret: 'eou5haou5ahou5eqo5uqh5u3çh5u5çohuh',
		cookie: { maxAge: 30000 }
	})
)

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use('/', categoriesController)
app.use('/', articlesController)
app.use('/', usersController)

app.get('/session', (req, res) => {
	req.session.trainamento = 'Formação NodeJS'
	req.session.ano = 2019
	req.session.user = {
		username: 'Richardson',
		email: 'email@email.com',
		id: Math.random(10, 36)
	}
	res.send('Sessão criada')
})

app.get('/leitura', (req, res) => {
	res.json({
		treinamento: req.session.trainamento,
		ano: req.session.ano,
		user: req.session.user
	})
})

// General Routes
app.use('/admin', (req, res) => {
	res.render('admin/index')
})

app.get('/', (req, res) => {
	Article.findAll({
		order: [['id', 'DESC']],
		limit: 4
	}).then((articles) => {
		Category.findAll().then((categories) => {
			res.render('index', { articles, categories })
		})
	})
})

app.get('/:slug', (req, res) => {
	var slug = req.params.slug
	Article.findOne({ where: { slug: slug } })
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
		where: { slug },
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
