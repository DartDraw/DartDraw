import React, { Component } from 'react';
import PropTypes from 'prop-types';

class BackgroundLayer extends Component {
    static propTypes = {
        width: PropTypes.number,
        height: PropTypes.number,
        fill: PropTypes.string
    };

    render() {
        const { width, height, fill } = this.props;
        return (
            <rect width={width} height={height} fill={fill} />
        );
    }
}

export default BackgroundLayer;
