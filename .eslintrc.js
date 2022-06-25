module.exports = {
	'env': {
		'browser': true,
		'es2021': true,
		'node': true
	},
	'extends': 'eslint:recommended',
	'parserOptions': {
		'ecmaVersion': 'latest',
		'sourceType': 'module'
	},
	'rules': {
		quotes: ['error', 'single'],
		indent: ['error', 'tab'],
		'comma-spacing': ['error', {
			before: false,
			after: true
		}]
	}
}