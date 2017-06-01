import React from 'react';
var pin = require('../../images/ic_room_white_24dp_2x.png');
var taxi = require('../../images/ic_local_taxi_white_24dp_2x.png');
var wine = require('../../images/ic_local_bar_white_24dp_2x.png');
var github = require('../../images/github_icon.png');
var yelp = require('../../images/yelp_fullcolor.png');

export default class Header extends React.component {
    render() {
        return (
            <div className='header'>
                <h1>Plans tonight?</h1>
                <div style={{ 'display': 'block' }}>
                    <img src={ pin } />
                    <img src={ taxi } />
                    <img src={ wine } />
                    <a className={ 'github-link' } href={ 'https://github.com/M1Gi/nightlife-coordination-app' } target={ '_blank' }>
                        <img src={ github } className={ 'github' } onDragStart={ function() { return false; }} />
                    </a>
                </div>
                <h4>See which bars are hoppin' tonight & RSVP ahead of time!<br/>
                Remember: take a cab and drink responsibly<br/>
                </h4>
            </div>
        );
    }
}
