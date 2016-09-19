var routes = require('../config/routes.json');

var preProcessors = [];

exports.dispatch = function(app) {
    // init url despatch
    var reqCfg = routes;
    var route, cfg;
    for ( var i = 0; i < reqCfg.length; i++) {
        cfg = reqCfg[i];
        route = require(cfg.path);
        // use configed method
        app[cfg.method](cfg.url, processReq(cfg, route[cfg.objName]));
    }
}

var processReq = function(routeCfg, processor) {
    return function(req, res, next) {
        for ( var i = 0, length = preProcessors.length; i < length; i++) {
            preProcessors[i](req, res, next, routeCfg);
        }

        processor(req, res, next);
    };
};

exports.setupPreProcessor = function(processor) {
    preProcessors.push(processor);
};

