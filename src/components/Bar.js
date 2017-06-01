import React from 'react';
var gear = require('../../images/ic_gear_white_24dp_2x.png');

export default class Bar extends React.Component {
    render() {
        if (this.props.loading === 'loading') {
            return (
                <div>
                    <img src={ gear } className={ 'spinning-gear' } />
                </div>
            );
        }
        
        var currentUserButton = undefined;
        if (this.props.bar.current_user_going) {
            currentUserButton = (
                <span className={ 'number-going current' }>
                    { this.props.bar.number_of_users_going || 0 }
                </span>
            );
        } else {
            currentUserButton = (
                <span className={ 'number-going current' }>
                    { this.props.bar.number_of_users_going || 0 }
                </span>
            );
        } 
        
        return (
            <div className='bar-card'>
                <a className={ 'bar-image-link' } href={ (this.props.bar.url || '#') } target='_blank'>
                    <img src={ this.props.bar.image_url } className={ 'bar-image' }/>
                </a>
                <div className={ 'bar-info' }>
                    <div className={ 'bar-info-name' }>
                        <b>{ this.props.bar.name }</b>
                    </div>
                    <div className={ 'bar-info-item' }>{ 'Price: ' + this.props.bar.price }</div>
                    <div className={ 'bar-info-item' }>{ 'Rating: ' + this.props.bar.rating }</div>
                </div>
                <button className={ 'going-button' } onClick={ this.props.handleGOINGOnClick.bind(this, this.props.bar.venueID) } >
                    { currentUserButton }GOING
                </button>
            </div>
        );
    }
}

