// importação do MongoDB
var mongo = require('mongodb');

var connMongoDB = function () {
    return new mongo.Db(
        'got',
        new mongo.Server(
            'localhost', //endereço do servidor
            27017, // porto
            {} // configurações do servidor
        ),
        {} // configurações adicionais
    );
};

module.exports = function () {
    return connMongoDB;
}