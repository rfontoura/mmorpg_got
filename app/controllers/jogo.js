module.exports.jogo = function (application, req, res) {
    if (req.session.autorizado !== true) {
        res.render('index', { validacao: {}, dadosForm: {} })
        return;
    }

    var comando_invalido = 'N';
    if (req.query.comando_invalido == 'S') {
        comando_invalido = 'S';
    }
    console.log(comando_invalido);
    
    var usuario = req.session.usuario;
    var casa = req.session.casa;

    var connection = application.config.dbConnection;
    var jogoDAO = new application.app.models.JogoDAO(connection);
    jogoDAO.iniciarJogo(res, usuario, casa, comando_invalido);

}

module.exports.sair = function (application, req, res) {
    req.session.destroy(function (error) {
        res.render('index', {
            validacao: [{ msg: 'Logoff efetuado.' }],
            dadosForm: {}
        });
    });
}

module.exports.suditos = function (application, req, res) {
    if (req.session.autorizado !== true) {
        res.render('index', { validacao: {}, dadosForm: {} })
        return;
    }

    res.render('aldeoes', { validacao: {} });
}

module.exports.pergaminhos = function (application, req, res) {
    if (req.session.autorizado !== true) {
        res.render('index', { validacao: {}, dadosForm: {} })
        return;
    }

    res.render('pergaminhos', { validacao: {} });
}

module.exports.ordenar_acao_sudito = function (application, req, res) {
    var dadosForm = req.body;
    req.assert('acao', 'Ação deve ser informada').notEmpty();
    req.assert('quantidade', 'Quantidade deve ser informada').notEmpty();

    var erros = req.validationErrors();
    if (erros) {
        res.redirect('jogo?comando_invalido=S');
        return;
    }

    var connection = application.config.dbConnection;
    var jogoDAO = new application.app.models.JogoDAO(connection);
    jogoDAO.acao(dadosForm);
}