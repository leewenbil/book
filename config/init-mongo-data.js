var MongoClient = require('mongodb').MongoClient;
var conf = require('./book-web.json');
var data = require('./initial-data.json');

function insertDocuments(db, collectionName, data, callback) {
    // Get the documents collection
    var collection = db.collection(collectionName);
    
    collection.insertMany(data, function(err, result) {
        callback(err, result);
    });
}

MongoClient.connect('mongodb://' + conf.mongo.host + ':' + conf.mongo.port + '/lm-book', function(err, db) {
    if (err) {
        cb(err);
    } else {
        console.log('Connected successfully to mongo server');
    }

    // init users collection
    console.log('initing users...');
    db.collection('users').drop();
    insertDocuments(db, 'users', data.users, function (err, result) {
        if (!err) {
            console.log('init users successfully.');
        } else {
            console.log('init users failed', err);
        }
        
        db.close();
    });
});



