import React, { Component } from 'react';
import PropTypes from 'prop-types';

class GridLayer extends Component {
    static propTypes = {
        scale: PropTypes.number,
        width: PropTypes.number,
        height: PropTypes.number,
        ticks: PropTypes.array
    };

    renderLines() {
        const { ticks, width, height } = this.props;
        return ticks.map((tick) => {
            return (
                <g>
                    <line
                        x1={tick[1]}
                        y1="0"
                        x2={tick[1]}
                        y2={height}
                        vectorEffect="non-scaling-stroke"
                        stroke="gray"
                        strokeWidth="0.5"
                    />
                    <line
                        x1="0"
                        y1={tick[1]}
                        x2={width}
                        y2={tick[1]}
                        vectorEffect="non-scaling-stroke"
                        stroke="gray"
                        strokeWidth="0.5"
                    />
                </g>
            );
        });
    }

    render() {
        return (
            <svg className="grid">
                {this.renderLines()}
            </svg>
        );
    }
}

export default GridLayer;

// <g>
//     <defs>
//         <pattern id="smallGrid" width={minorGrid} height={minorGrid} patternUnits="userSpaceOnUse">
//             <path d={"M " + minorGrid + " 0 L 0 0 0 " + minorGrid} fill="none" stroke="#adadad" strokeWidth={0.5 / scale} />
//         </pattern>
//         <pattern id="grid" width={majorGrid} height={majorGrid} patternUnits="userSpaceOnUse">
//             <rect width={majorGrid} height={majorGrid} fill="url(#smallGrid)" />
//             <path d={"M " + majorGrid + " 0 L 0 0 0 " + majorGrid} fill="none" stroke="#adadad" strokeWidth={1 / scale} />
//         </pattern>
//     </defs>
//     <rect width={width} height={height} fill="url(#grid)" pointerEvents="none" />
// </g>
