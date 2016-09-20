var express = require('express');
var conf = require('../config/book-web.json');
var cluster = require('cluster');
var FileStreamRotator = require('file-stream-rotator');
var fs = require('fs');
var morgan = require('morgan');
var path = require('path');
var _ = require('lodash');

var app = express();
var logDirectory = path.join(__dirname, '../log');

// ensure log directory always exist
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

if (cluster.isMaster) {
    var logger = require("./utils/log_util.js").getLogger('app/index.js');
    
    for (var i = 0; i < conf.workers; ++i) {
        cluster.fork();
    }

    cluster.on('online', function (worker) {
        logger.info('worker ' + worker.process.pid + ' online');
    });

    cluster.on('exit', function (worker) {
        var exitCode = worker.process.exitCode;

        logger.info('worker ' + worker.process.pid + ' died ('+ exitCode +'). restarting...');
        cluster.fork();
    });
} else {
    var accessLogStream = FileStreamRotator.getStream({
        date_format: 'YYYYMMDD',
        filename: path.join(logDirectory, 'access-%DATE%.log'),
        frequency: 'daily',
        verbose: false
    });

    // use access logs
    app.use(morgan('combined', {stream: accessLogStream}));

    app.set('views', __dirname + '/../views');

    var exphbs = require('express-handlebars');
    app.engine('handlebars', exphbs({
        defaultLayout: 'layout'
    }));
    app.set('view engine', 'handlebars');

    var compression = require('compression');
    app.use(compression());

    var bodyParser = require('body-parser');
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    var cookieParser = require('cookie-parser');
    app.use(cookieParser());

    var session = require('express-session');
    app.use(session({
        secret: 'do you know who am i?',
        cookie: {
            maxAge: conf.sessionTimeout
        },
        saveUninitialized: true,
        resave: false
    }));

    var methodOverride = require('method-override');
    app.use(methodOverride());

    app.use(express.static(__dirname + '/../static'));

    app.use(function (req, res, next) {
        var path = req.path;
        
        if (/^\/login.html/.test(path) || /^\/api\/login/.test(path)) {
            if (req.session.user) {
                res.redirect('/');
            } else {
                next();
            }
        } else {
            if (!req.session.user) {
                if (/^\/api\//.test(path)) {
                    res.status(403).send('Need Authentication');
                } else {
                    res.redirect('/login.html');
                }
            } else {
                next();
            }
        }
    });

    // Init routes
    var rDes = require('./dispatch.js');
    rDes.dispatch(app);

    app.listen(conf.port, function () {
        console.log("Business server listening on port %d in %s mode", conf.port, app.get('env'));
    });
}
