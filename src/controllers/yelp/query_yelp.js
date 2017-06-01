var axios = require('axios');
var qs = require('querystring');

module.exports = function(req, res, next) {
    console.log('IN QUERY_YELP');
    
    var url = 'https://api.yelp.com/v3/businesses/search';
    url += '?categories=bars';
    url += '&location=' + req.body.location;
    
    axios({
        method: 'get',
        url: url,
        headers: { 'Authorization': ('Bearer ' + req.token) }
    }).then(function(response) {
        // Only pass along the data that's required
        var businesses = response.data.businesses.map(function(business) {
            return {
                name: business.name,
                venueID: business.id,
                price: business.price,
                rating: business.rating,
                image_url: business.image_url,
                url: business.url
            };
        })
        
        req.query_data = businesses;
        next();
        
    }).catch(function(err) {
        next(err);
    });
}
