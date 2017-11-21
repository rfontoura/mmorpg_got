module.exports = function (application) {
	application.get('/', function (req, res) {
		res.send('Bem vindo à sua app NodeJS!');
	});
}