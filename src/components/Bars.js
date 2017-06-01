import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Bar from './Bar';

export default class Bars extends React.component {
    render() {
        var _this = this;
        var bars = undefined;
        
        if (this.props.bars && this.props.bars !== 'loading') {
            bars = this.props.bars.map(function(bar, i) {
                return (
                    <Bar bar={ bar } key={ bar.venueID } handleGOINGOnClick={ _this.props.handleGOINGOnClick.bind(_this) } />
                );
            })
        } else if (this.props.bars === 'loading') {
            bars = [<Bar loading={ 'loading' } key='loading' />];
        }
        
        return (
            <div className='bars'>
                <ReactCSSTransitionGroup transitionName='bars' transitionEnterTimeout={ 200 } transitionLeaveTimeout={ 200 }>
                    { bars }
                </ReactCSSTransitionGroup>
            </div>
        );
    }
}
