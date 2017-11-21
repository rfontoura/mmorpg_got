module.exports = function (application) {
    application.get('/pergaminhos', function (req, res) {
        res.render('pergaminhos');
    });
}