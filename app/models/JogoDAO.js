function JogoDAO(connection) {
    this._connection = connection();
}

JogoDAO.prototype.gerarParametros = function (usuario) {
    this._connection.open(function (error, mongoClient) {
        mongoClient.collection('jogo', function (error, collection) {
            collection.insert({
                usuario: usuario,
                moeda: 15,
                suditos: 10,
                temor: Math.floor(Math.random() * 1000 + 1), // valores inteiros entre 1 e 1000
                sabedoria: Math.floor(Math.random() * 1000 + 1),
                comercio: Math.floor(Math.random() * 1000 + 1),
                magia: Math.floor(Math.random() * 1000 + 1)
            });
            mongoClient.close(); // fechando conexão após uso
        });
    });
}

JogoDAO.prototype.iniciarJogo = function (res, usuario, casa, comando_invalido) {
    this._connection.open(function (error, mongoClient) {
        mongoClient.collection('jogo', function (error, collection) {
            collection.find({ usuario: usuario }).toArray(function (error, result) {

                console.log(result);
                res.render('jogo', { img_casa: casa, jogo: result[0], comando_invalido: comando_invalido });
                mongoClient.close();
            });
        });
    });
}

module.exports = function () {
    return JogoDAO;
}