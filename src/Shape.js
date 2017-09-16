import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Shape extends Component {
    static propTypes = {
        id: PropTypes.number,
        width: PropTypes.number,
        height: PropTypes.number,
        x: PropTypes.number,
        y: PropTypes.number
    }

    render() {
        const { width, height, x, y } = this.props;

        return (
            <rect
                width={width}
                height={height}
                x={x}
                y={y}
            />
        );
    }
}

export default Shape;
