require('dotenv').config({
    silent: true
});
var express = require('express');
var logger = require('morgan');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

app.use(logger('tiny'));

// Models
var User = require('./src/models/user');
var Venue = require('./src/models/venue');

// Controllers
var get_yelp_token = require('./src/controllers/yelp/get_yelp_token');
var query_yelp = require('./src/controllers/yelp/query_yelp');
var add_going_data_from_db = require('./src/controllers/yelp/add_going_data_from_db');

// Serve Files
app.get('/favicon.ico', function(req, res) {
    res.sendFile(path.join(__dirname, 'favicon.ico'));
});

app.use('/dist', express.static(path.join(__dirname, 'dist')));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
});

// Authentication
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(require('express-session') ({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}));

var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'https://nightlife-coordination-app-a5p00k3y.c9users.io/auth/google/callback'
    },
    function(accessToken, refreshToken, profile, done) {
        console.log('GOOGLE PROFILE: ', profile.displayName);
        
        User.findOrCreate({
            googleID: profile.id,
            displayName: profile.displayName
        }, function(err, user) {
            console.log('USER IN DB: ', user.displayName);
            return done(err, user);
        });
    }
));

passport.serializeUser(function(user, done) {
    console.log('SERIALIZE: ', user);
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    console.log('DESERIALIZE: ', id);
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

app.get('/auth/google', 
    passport.authenticate('google', {
        scope: ['https://www.googleapis.com/auth/plus.login']
    })
);

app.get('/auth/google/callback', 
    passport.authenticate('google', {
        failureRedirect: '/login' 
    }),
    function(req, res) {
        console.log('Logged In Redirect');
        res.redirect('/');
        console.log(req.session);
    }
);

// API
app.post('/api/toggle_going', function(req, res) {
    console.log('INSIDE TOGGLE_GOING');
    
    if (req.session && req.session.passport) {
        console.log('VENUE: ', req.body.venueID);
        console.log('USER: ', req.session.passport.user);
        
        Venue.findOrCreate({ venueID: req.body.venueID }, function(err, venue) {
            if (err) throw err;
            
            console.log('Found or Created: ', venue);
            
            venue.toggleUserGoing({ userID: req.session.passport.user }, function(err, data, currentUser) {
                console.log('INSIDE TOGGLEUSERGOING CB');
                console.log(data);
                if (err) {
                    res.json({ success: false, business: data }).end();
                } else {
                    res.json({ success: true, business: data, current_user_going: currentUser }).end();
                }
            });
        });
    } else {
        console.log('Redirect to auth');
        res.json({ success: false, user: undefined, venue: req.body.venueID }).end();
    }
});

app.post('/api/location_search', get_yelp_token, query_yelp, add_going_data_from_db);

// Start Server
var port = process.env.PORT || 8080;
app.listen(port, function() {
    console.log('Node.js listening on port ' + port);
});




























