var ajax = require('../utils/response_util.js');
var logger = require("../utils/log_util.js").getLogger('login/login_controller.js');

var IndexController = module.exports = {};

IndexController.getIndexPage = function (req, res) {
    res.render('index');
};

