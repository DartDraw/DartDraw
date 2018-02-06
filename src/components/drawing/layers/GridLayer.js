
import React, { Component } from 'react';
import PropTypes from 'prop-types';

class GridLayer extends Component {
    static propTypes = {
        canvasWidth: PropTypes.number,
        canvasHeight: PropTypes.number,
        ruler: PropTypes.object,
        panX: PropTypes.number,
        panY: PropTypes.number,
        scale: PropTypes.number,
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

    renderVerticalLines() {
        const { canvasWidth, showSubDivisions, ruler, scale, panY } = this.props;
        return ruler.vertical.ticks.map((line) => {
            if ((showSubDivisions || line.major) && line.loc !== 0) {
                return (
                    <g key={line.loc} >
                        {this.buildGridLine(0, line.loc / scale + panY, canvasWidth, line.loc / scale + panY, line.major)}
                    </g>
                );
            }
        });
    }

    renderHorizontalLines() {
        const { canvasHeight, showSubDivisions, ruler, scale, panX } = this.props;
        return ruler.horizontal.ticks.map((line) => {
            if ((showSubDivisions || line.major) && line.loc !== 0) {
                return (
                    <g key={line.loc} >
                        {this.buildGridLine(line.loc / scale + panX, 0, line.loc / scale + panX, canvasHeight, line.major)}
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
                {this.renderHorizontalLines()}
                {this.renderVerticalLines()}
            </svg>
        );
    }
}

export default GridLayer;
