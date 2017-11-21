// importação do MongoDB
var mongo = require('mongodb');

var connMongoDB = function () {
    console.log('Entrou na função de conexão.');
    var db = new mongo.Db(
        'got',
        new mongo.Server(
            'localhost', //endereço do servidor
            27017, // porto
            {} // configurações do servidor
        ),
        {} // configurações adicionais
    );

    return db;
};

module.exports = function () {
    return connMongoDB;
}