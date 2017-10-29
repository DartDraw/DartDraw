import React, { Component } from 'react';
import PropTypes from 'prop-types';

class GridLayer extends Component {
    static propTypes = {
        width: PropTypes.number,
        height: PropTypes.number
    };

    render() {
        const { width, height } = this.props;
        return (
            <g>
                <defs>
                    <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="gray" strokeWidth="0.5" />
                    </pattern>
                    <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                        <rect width="100" height="100" fill="url(#smallGrid)" />
                        <path d="M 100 0 L 0 0 0 100" fill="none" stroke="gray" strokeWidth="1" />
                    </pattern>
                </defs>
                <rect width={width} height={height} fill="url(#grid)" pointerEvents="none" />
            </g>
        );
    }
}

export default GridLayer;
