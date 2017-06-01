import React, { Component } from 'react';

export default class Input extends component {
    constructor(props) {
        super(props);
        
        if (localStorage.getItem('currentState')) {
            this.state = {
                location: JSON.parse(localStorage.getItem('currentState')).last_search
            };
            localStorage.removeItem('currentState');
        } else {
            this.state = {
                location: ''
            };
        }
    }
    
    handleInputField(event) {
        this.setState({ location: event.target.value });
    }
    
    render() {
        return (
            <form className={ 'input-container' }>
                <input onChange={ this.handleInputField.bind(this) } type={ 'text' } className={ 'location-input' } placeholder={ 'enter a location...' } autoFocus={ true } value={ this.state.location } />
                <button onClick={ this.handleLocationSubmit.bind(this, this.state.location) } type={ 'submit' } className={ 'go-button' }>GO</button>
            </form>
        );
    }
}

