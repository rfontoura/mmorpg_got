var ObjectID = require('mongodb').ObjectID;

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

JogoDAO.prototype.iniciarJogo = function (res, usuario, casa, msg) {
    this._connection.open(function (error, mongoClient) {
        mongoClient.collection('jogo', function (error, collection) {
            collection.find({ usuario: usuario }).toArray(function (error, result) {

                console.log(result);
                res.render('jogo', { img_casa: casa, jogo: result[0], comando_invalido: msg });
                mongoClient.close();
            });
        });
    });
}

JogoDAO.prototype.acao = function (acao) {
    this._connection.open(function (error, mongoClient) {
        mongoClient.collection('acoes', function (error, collection) {

            var date = new Date();
            var tempo = null;
            switch (parseInt(acao.acao)) {
                case 1:
                    tempo = 1 * 60 * 60000; // coletar recursos (1h)
                    break;
                case 2:
                    tempo = 2 * 60 * 60000; // enforcar aldeão (2h)
                    break;
                case 3:
                    tempo = 5 * 60 * 60000; // ensinar história (5h)
                    break;
                case 4:
                    tempo = 5 * 60 * 60000; // ensinar magia (5h)
                    break;
            }

            acao.acao_termina_em = date.getTime() + tempo;
            collection.insert(acao);
        });

        mongoClient.collection('jogo', function (error, collection) {
            var moedas = null;
            switch (parseInt(acao.acao)) {
                case 1:
                    moedas = -2 * acao.quantidade;
                    break;
                case 2:
                    moedas = -3 * acao.quantidade;
                    break;
                case 3:
                    moedas = -1 * acao.quantidade;
                    break;
                case 4:
                    moedas = -1 * acao.quantidade;
                    break;
            }

            collection.update(
                { usuario: acao.usuario },
                { $inc: { moeda: moedas } }); // '$inc' incrementa o valor do campo na collection

            mongoClient.close();
        });
    });
}

JogoDAO.prototype.getAcoes = function (usuario, res) {
    this._connection.open(function (error, mongoClient) {
        mongoClient.collection('acoes', function (error, collection) {

            // listando somente ações que ainda não tiveram tempo finalizado
            var momento_atual = new Date().getTime();
            collection.find({
                usuario: usuario,
                acao_termina_em: { $gt: momento_atual }
            }).toArray(function (error, result) {
                res.render('pergaminhos', { acoes: result });
                mongoClient.close();
            });
        });
    });
}

JogoDAO.prototype.revogarAcao = function (_id, res) {
    this._connection.open(function (error, mongoClient) {
        mongoClient.collection('acoes', function (error, collection) {
            collection.remove(
                { _id: ObjectID(_id) },
                function (error, result) {
                    res.redirect('/jogo?msg=D');
                    mongoClient.close();
                })
        });
    });
}

module.exports = function () {
    return JogoDAO;
}