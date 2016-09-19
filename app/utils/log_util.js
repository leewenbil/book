var log4js = module.exports = require('log4js');
var conf = require('../../config/book-web.json');
var path = require('path');

log4js.configure(conf.logging.log4js, {cwd: path.join(__dirname, '../../log')});
