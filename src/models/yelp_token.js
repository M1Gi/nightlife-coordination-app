var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var Schema = mongoose.Schema;

var db = mongoose.createConnection(process.env.MONGOLAB_URI || 'mongodb://localhost/nightlife-app');

var YelpTokenSchema = new Schema({
    access_token: { type: String, required: true, unique: true },
    token_type: { type: String, require: true },
    expireAt: { type: Date, required: true }
});

YelpTokenSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

var Yelp_Token = db.model('Yelp_Token', YelpTokenSchema, 'yelp_token');

module.exports = Yelp_Token;
