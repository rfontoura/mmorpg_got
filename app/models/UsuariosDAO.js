function UsuariosDAO(connection) {
    this._connection = connection();
}

UsuariosDAO.prototype.inserirUsuario = function (usuario) {
    this._connection.open(function(error, mongoClient) {
        mongoClient.collection('usuarios', function(error, collection) {
            collection.insert(usuario);
            mongoClient.close(); // fechando conexão após uso
        });
    });
}

module.exports = function () {
    return UsuariosDAO;
}