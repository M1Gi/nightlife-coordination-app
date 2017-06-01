var axios = require('axios');
var qs = require('querystring');
var queue = require('queue');
var read_yelp_token = require('../yelp_token/read_yelp_token');
var create_yelp_token = require('../yelp_token/create_yelp_token');

module.exports = function(req, res, next) {
    console.log('IN GET YELP_TOKEN');
    
    var q = queue({ concurrency: 1 });
    // Async Functions: Check Database, Get Token from Yelp, Save Token
    q.push(function(cb) {
        // Check for Yelp Token in db
        read_yelp_token(req, res, cb, next);
    }, function(cb) {
        // If not in the db, request a new token from Yelp
        axios.post('https://api.yelp.com/oauth2/token', qs.stringify({
            'grant_type': 'client_credentials',
            'client_id': process.env.APP_ID,
            'client_secret': process.env.APP_SECRET
        })).then(function(response) {
            console.log('TOKEN RECEIVED FROM YELP');
            req.token_data = response.data;
            req.token = response.data.access_token;
            cb();
        }).catch(function(err) {
            cb(err);
        });
    }, function(cb) {
        // Save new token in the db
        create_yelp_token(req.token_data, cb);
    });
    
    q.start(function() {
        next();
    });
};

