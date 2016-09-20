var userService = require('./user_service.js');
var UserController = module.exports = {};
var ajax = require('../utils/response_util.js');
var _ = require('lodash');

UserController.getUserByName = function (req, res) {
    var username = req.params.username;

    userService.getUserByName(username, function (err, user) {
        user = user || null;
        
        if (user) {
            user.password = '******';
        }
        
        ajax.sendResult(!err, req, res, err, user);
    });
};

UserController.getUsers = function (req, res) {
    userService.getUsers(function (err, users) {
        if (users) {
            _.each(users, function (user) {
                user.password = '******';
            });
        }
        
        ajax.sendResult(!err, req, res, err, users);
    });
};

UserController.addUser = function (req, res) {
    var user = req.body;
    userService.addUser(user, function (err, user) {
        if (user) {
            user.password = '******';
        }

        ajax.sendResult(!err, req, res, err, user);
    });
};

UserController.updateUser = function (req, res) {
    var user = req.body;
    userService.updateUser(user, function (err, user) {
        if (user) {
            user.password = '******';
        }

        ajax.sendResult(!err, req, res, err, user);
    });
}

