import React, { Component } from 'react';
import PropTypes from 'prop-types';

class GridLayer extends Component {
    static propTypes = {
        width: PropTypes.number,
        height: PropTypes.number,
        majorGrid: PropTypes.number,
        minorGrid: PropTypes.number
    };

    render() {
        const { width, height, majorGrid, minorGrid } = this.props;
        return (
            <g>
                <defs>
                    <pattern id="smallGrid" width={minorGrid} height={minorGrid} patternUnits="userSpaceOnUse">
                        <path d={"M " + minorGrid + " 0 L 0 0 0 " + minorGrid} fill="none" stroke="#adadad" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
                    </pattern>
                    <pattern id="grid" width={majorGrid} height={majorGrid} patternUnits="userSpaceOnUse">
                        <rect width={majorGrid} height={majorGrid} fill="url(#smallGrid)" />
                        <path d={"M " + majorGrid + " 0 L 0 0 0 " + majorGrid} fill="none" stroke="#adadad" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                    </pattern>
                </defs>
                <rect width={width} height={height} fill="url(#grid)" pointerEvents="none" />
            </g>
        );
    }
}

export default GridLayer;
