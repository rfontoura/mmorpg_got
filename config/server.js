/* importar o módulo do framework express */
var express = require('express');

/* importar o módulo do consign */
var consign = require('consign');

/* importar o módulo do body-parser */
var bodyParser = require('body-parser');

/* importar o módulo do express-validator */
var expressValidator = require('express-validator');

/* iniciar o objeto do express */
var app = express();

// importação do módulo Express-Session
var expressSession = require('express-session');

/* setar as variáveis 'view engine' e 'views' do express */
app.set('view engine', 'ejs');
app.set('views', './app/views');

/* configurar o middleware express.static */
app.use(express.static('./app/public'));

/* configurar o middleware body-parser */
app.use(bodyParser.urlencoded({ extended: true }));

/* configurar o middleware express-validator */
app.use(expressValidator());

/* configurar o middleware express-validator */
app.use(expressSession({
	secret: 'a65ds1f98a4s1f984qe', // chave utilizada para assinar o cookie de sessão
	resave: false, // se for true, faz com que a sessão seja regravada no servidor, mesmo sem alteração no request
	saveUninitialized: false // sessão nova sempre que ela for modificada
}));

/* efetua o autoload das rotas, dos models e dos controllers para o objeto app */
consign()
	.include('app/routes')
	.then('config/dbConnection.js') // passando a extensão para que entenda que não é um diretório
	.then('app/models')
	.then('app/controllers')
	.into(app);

/* exportar o objeto app */
module.exports = app;