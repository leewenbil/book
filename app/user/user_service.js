var DB = require('../utils/db.js');
var md5 = require('md5');
var _ = require('lodash');

var userService = module.exports = {};

userService.getUserByName = function (username, cb) {
    DB.getDB(function (err, db) {
        if (err) {
            cb(err);
        } else {
            db.collection('users').find({username: username}).toArray(function(err, result) {
                if (err) {
                    cb(err);
                } else {
                    cb(null, result[0]);
                }
            });
        }
    });
};

userService.getUsers = function (cb) {
    DB.getDB(function (err, db) {
        if (err) {
            cb(err);
        } else {
            db.collection('users').find().toArray(function(err, result) {
                if (err) {
                    cb(err);
                } else {
                    cb(null, result);
                }
            });
        }
    });
};

userService.addUser = function (user, cb) {
    DB.getDB(function (err, db) {
        if (err) {
            cb(err);
        } else {
            user.password = md5(user.password);
            DB.insertDocuments(db, 'users', [user], function (err, result) {
                cb(err, result ? result[0] : null);
            });
        }
    });
};


userService.updateUser = function (user, cb) {
    DB.getDB(function (err, db) {
        if (err) {
            cb(err);
        } else {
            user.password = md5(user.password);
            
            userService.getUserByName(user.username, function (err, oldUser) {
                if (user) {
                    // only update the user when the old password is correct.
                    if (user.oldPassword && md5(user.oldPassword) == oldUser.password) {
                        db.collection('users').updateOne({
                            username: user.username
                        }, _.omit(user, 'oldPassword'), function (err) {
                            cb(err, err ? null : _.omit(user, 'oldPassword'));
                        });
                    } else {
                        cb('error');
                    }
                } else {
                    cb('error');
                }
            });
            
        }
    });

};

userService.deleteUser = function (user, cb) {
    
};
