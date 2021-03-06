var ajax = require('../utils/response_util.js');
var logger = require('../utils/log_util.js').getLogger('login/login_controller.js');
var userService = require('../user/user_service.js');
var md5 = require('md5');

var LoginController = module.exports = {};

LoginController.login = function (req, res) {
    if (req.session.user) {
        logger.info(req.session.user.username + ' is already logined.');
        ajax.sendResult(true, req, res, 'you\'re already logined.', {username: req.session.user.username});
    } else {
        var username = req.body.username;
        var password = req.body.password;
        
        userService.getUserByName(username, function (err, result) {
            if (!err && result) {

                if (result.password.toLowerCase() == md5(password).toLowerCase()) {
                    req.session.user = {
                        username: 'admin'
                    };
                    logger.info(req.session.user.username + ' is logined.');
                    ajax.sendResult(true, req, res, '', {username: req.session.user.username});
                    return;
                } 
            }
            
            ajax.sendResult(false, req, res, 'username or password is not correctly');
        });
    }
};

LoginController.getLoginPage = function (req, res) {
    res.render('login');
};

LoginController.logout = function (req, res) {
    req.session.user = null;
    ajax.sendResult(true, req, res, 'logout successfully');
};
