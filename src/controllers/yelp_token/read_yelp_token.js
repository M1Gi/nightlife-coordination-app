var Yelp_Token = require('../../models/yelp_token');

module.exports = function(req, res, cb, next) {
    var yelp_token = Yelp_Token.find({}).exec(function(err, token) {
        if (err) {
            console.log('ERROR: ', err);
            cb(err);
        } else {
            console.log('Token from database: ', (token.length > 0));
            if (token.length === 0) {
                cb();
            } else {
                req.token = token[0].access_token;
                next();
            }
        }
    });
};

