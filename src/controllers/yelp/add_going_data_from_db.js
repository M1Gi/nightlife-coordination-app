var axios = require('axios');
var qs = require('querystring');
var map = require('async/map');
var mapSeries = require('async/mapSeries');
var Venue = require('../../models/venue');

module.exports = function(req, res, next) {
    console.log('IN ADD GOING DATA FROM DB');
    console.log(req.user);
    
    // There must be a better way to pass this into add_going_data
    if (req.session && req.session.passport) {
        id = req.session.passport.user;
    } else {
        id = undefined;
    }
    map(req.query_data, add_going_data, function(err, results) {
        res.json({ success: true, businesses: results });
    });
}

function add_going_data(business, cb) {
    Venue.findOne({ venueID: business.venueID }, function(err, obj) {
        if (err) {
            cb(err);
        }
        // If venue is found in db
        if (obj) {
            business.number_of_users_going = obj.number_of_users_going;
            business.users_going = obj.users_going.slice();
            if (id) {
                business.current_users_going = (obj.users_going.indexOf(id) > -1 ? true : false);
            }
            cb(null, business);
        } else { // If it's not in the db
            business.number_of_users_going = 0;
            business.users_going = [];
            business.current_user_going = false;
            cb(null, business);
        }
    });
}









































