module.exports.cadastro = function (application, req, res) {
    res.render('cadastro', { validacao: {}, dadosForm: {} });
}

module.exports.cadastrar = function (application, req, res) {
    var dadosForm = req.body;

    req.assert('nome', 'Nome não pode ser vazio').notEmpty();
    req.assert('usuario', 'Usuário não pode ser vazio').notEmpty();
    req.assert('senha', 'Senha não pode ser vazio').notEmpty();
    req.assert('casa', 'Escolha da casa é obrigatório').notEmpty();

    var erros = req.validationErrors();
    if (erros) {
        res.render('cadastro', { validacao: erros, dadosForm: dadosForm });
        return;
    }

    var connection = application.config.dbConnection;
    console.log(connection);

    var usuariosDAO = new application.app.models.UsuariosDAO(connection);
    var jogoDAO = new application.app.models.JogoDAO(connection);
    usuariosDAO.inserirUsuario(dadosForm);
    jogoDAO.gerarParametros(dadosForm.usuario); // fornece nome de usuário

    res.render('cadastro-efetuado');
}