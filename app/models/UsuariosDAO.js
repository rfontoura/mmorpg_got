var crypto = require('crypto');

function UsuariosDAO(connection) {
    this._connection = connection();
}

UsuariosDAO.prototype.inserirUsuario = function (usuario) {
    this._connection.open(function (error, mongoClient) {
        mongoClient.collection('usuarios', function (error, collection) {
            // criptografando senha antes de salvar
            var senhaCripto = crypto.createHash('md5').update(usuario.senha).digest('hex');
            usuario.senha = senhaCripto;

            collection.insert(usuario);
            mongoClient.close(); // fechando conexão após uso
        });
    });
}

UsuariosDAO.prototype.autenticar = function (usuario, req, res) {
    this._connection.open(function (error, mongoClient) {
        mongoClient.collection('usuarios', function (error, collection) {
            // criptografando senha
            usuario.senha = crypto.createHash('md5').update(usuario.senha).digest('hex');
            collection.find(usuario).toArray(function (error, result) {
                if (result[0] != undefined) {
                    req.session.autorizado = true;
                    req.session.usuario = result[0].usuario;
                    req.session.casa = result[0].casa;
                }

                if (req.session.autorizado) {
                    res.redirect('jogo');
                } else {
                    // exibe mensagem de erro na tela de login
                    res.render('index', {
                        validacao: [{ msg: 'Usuário ou senha inválidos.' }],
                        dadosForm: req.body
                    });
                }
                mongoClient.close();
            });
        });
    });
}

module.exports = function () {
    return UsuariosDAO;
}