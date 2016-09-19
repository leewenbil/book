var responseUtil = module.exports = {};

responseUtil.sendResult = function(isSuccess, req, res, msg, data) {
    res.send({
        status: isSuccess ? "SUCCESS" : "FAILURE",
        msg : msg,
        data : data
    });
};
