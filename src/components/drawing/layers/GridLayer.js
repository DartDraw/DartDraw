
import React, { Component } from 'react';
import PropTypes from 'prop-types';

class GridLayer extends Component {
    static propTypes = {
        canvasWidth: PropTypes.number,
        canvasHeight: PropTypes.number,
        lines: PropTypes.object,
        showGrid: PropTypes.bool,
        showSubDivisions: PropTypes.bool
    };

    buildGridLine(x1, y1, x2, y2, isMajor) {
        return (
            <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                vectorEffect="non-scaling-stroke"
                stroke={isMajor ? "black" : "gray"}
                strokeWidth={isMajor ? "1" : "0.5"}
                strokeDasharray="1, 5"
            />
        );
    }

    renderMajorLines() {
        const { canvasWidth, canvasHeight, lines, showSubDivisions } = this.props;
        return lines.map((line) => {
            if (showSubDivisions || line.major) {
                return (
                    <g>
                        {this.buildGridLine(line.loc, 0, line.loc, canvasHeight, line.major)}
                        {this.buildGridLine(0, line.loc, canvasWidth, line.loc, line.major)}
                    </g>
                );
            }
        });
    }

    render() {
        const { showGrid } = this.props;
        return (
            <svg className="grid"
                display={showGrid ? "" : "none"}
            >
                {this.renderMajorLines()}
            </svg>
        );
    }
}

export default GridLayer;
