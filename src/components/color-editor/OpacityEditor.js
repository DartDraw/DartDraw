import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './color-menu.css';

class OpacityEditor extends Component {
    static propTypes = {

    };

    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        console.log('changing the opacity');
        console.log(event);
    }

    render() {
        return (
            <div>
                <input type="range" min="1" max="100" value="50" onChange={this.handleChange} />
                <input type="text" />
            </div>
        );
    }
}

export default OpacityEditor;
