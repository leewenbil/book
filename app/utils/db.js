var MongoClient = require('mongodb').MongoClient;
var conf = require('../../config/book-web.json');


var db = null;


exports.getDB = function (cb) {
    if (db) {
        cb(null, db);
    } else {
        MongoClient.connect('mongodb://' + conf.mongo.host + ':' + conf.mongo.port + '/lm-book', function(err, db) {
            if (err) {
                cb(err);
            } else {
                cb(null ,db);
            }
        });
    }
}; 

exports.insertDocuments = function (db, collectionName, data, callback) {
    // Get the documents collection
    var collection = db.collection(collectionName);

    collection.insertMany(data, function(err, result) {
        if (!err) {
            result = result.ops;
        } else {
            result = [];
        }
        callback(err, result);
    });
};
