import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ColorSquare extends Component {
    static propTypes = {
        color: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    render() {
        let {color} = this.props;
        const colorSquareStyle = {
            backgroundColor: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`
        };
        return (
            <div className="color-square" style={colorSquareStyle} />
        );
    }
}

export default ColorSquare;
