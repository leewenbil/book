var ajax = require('../utils/response_util.js');
var logger = require("../utils/log_util.js").getLogger('login/login_controller.js');

var LoginController = module.exports = {};

LoginController.login = function (req, res) {
    if (req.session.user) {
        logger.info(req.session.user.username + ' is already logined.');
        ajax.sendResult(true, req, res, 'you\'re already logined.', {username: req.session.user.username});
    } else {
        var username = req.body.username;
        var password = req.body.password;
        
        if (username == 'admin' && password == '12345') {
            req.session.user = {
                username: 'admin'
            };
            logger.info(req.session.user.username + ' is logined.');
            ajax.sendResult(true, req, res, '', {username: req.session.user.username});
        } else {
            ajax.sendResult(false, req, res, 'username or password is not correctly');
        }
    }
};

LoginController.getLoginPage = function (req, res) {
    res.render('login');
};
