import React from 'react';
import axios from 'axios';
import Header from './Header';
import Input from './Input';
import Bars from './Bars';
import '../scss/main.scss';

if (module.hot) {
    module.hot.accept();
    console.log('That\'s hot');
}

export default class App extends React.component {
    constructor(props) {
        super(props);
        // If localStorage was set, retrieve it, update app state & then delete the localStorage item
        if (localStorage.getItem('currentState')) {
            var _this = this;
            var location = JSON.parse(localStorage.getItem('currentState')).last_search;
            var location_enc = location.split(' ').join('+');
            
            axios.post('/api/location_search', { location: location_enc })
                .then(function(response) {
                    _this.setState({ bars: response.data.businesses, last_search: location });
                });
                
            this.state = JSON.parse(localStorage.getItem('currentState'));
            
        } else {
            this.state = {
                last_search: undefined,
                bars: undefined
            };
        }
    }
    
    handleGOINGOnClick(venueID, event) {
        event.preventDefault();
        var _this = this;
        
        axios.post('/api/toggle_going', { venueID: venueID })
            .then(function(response) {
                if (response.data.success) {
                    var newBars = _this.state.bars.map(function(bar) {
                        if (bar.venueID === response.data.business.venueID) {
                            bar.number_of_users_going = response.data.business.number_of_users_going;
                            bar.users_going = response.data.business.users_going.slice();
                            bar.current_user_going = response.data.current_user_going;
                            return bar;
                        } else {
                            return bar;
                        }
                    })
                    _this.setState({ bars: newBars })
                } else {
                    console.log(response.data);
                    // Save current state for when redirected back from Google
                    localStorage.setItem('currentState', JSON.stringify({ bars: _this.state.bars, last_search: _this.state.last_search }));
                    
                    window.location.href = '/auth/google';
                }
            });
    }
    
    handleLocationSubmit(location, event) {
        event.preventDefault();
        var _this = this;
        // If the input field is empty, exit early
        if (!location) return;
        // If the user searched for the same location twice, exit early
        if (location === this.state.last_search) return;
        
        this.setState({ bars: undefined });
        setTimeout(function() {
            _this.setState({ bars: 'loading', last_search: location });
        }, 200);
        
        var location_enc = location.split(' ').join('+');
        
        axios.post('/api/location_search', { location: location_enc })
            .then(function(response) {
                _this.setState({ bars: undefined });
                
                setTimeout(function() {
                    _this.setState({ bars: response.data.businesses });
                }, 200);
            });
    }
    
    render() {
        return (
            <div className='app'>
                <Header/>
                <Input handleLocationSubmit={ this.handleLocationSubmit.bind(this) } />
                <div className={ 'buffer' }/>
                <Bars bars={ this.state.bars } handleGOINGOnClick={ this.handleGOINGOnClick.bind(this) }/>
            </div>
        );
    }
}

