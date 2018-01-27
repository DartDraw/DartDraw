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

    renderMajorLines() {
        const { canvasWidth, canvasHeight, lines } = this.props;
        return lines.divisions.map((line) => {
            return (
                <g>
                    <line
                        x1={line}
                        y1="0"
                        x2={line}
                        y2={canvasHeight}
                        vectorEffect="non-scaling-stroke"
                        stroke="black"
                        strokeWidth="1"
                    />
                    <line
                        x1="0"
                        y1={line}
                        x2={canvasWidth}
                        y2={line}
                        vectorEffect="non-scaling-stroke"
                        stroke="black"
                        strokeWidth="1"
                    />
                </g>
            );
        });
    }

    renderMinorLines() {
        const { canvasWidth, canvasHeight, lines, showSubDivisions } = this.props;
        return lines.subDivisions.map((line) => {
            return (
                <g display={showSubDivisions ? "" : "none"}>
                    <line
                        x1={line}
                        y1="0"
                        x2={line}
                        y2={canvasHeight}
                        vectorEffect="non-scaling-stroke"
                        stroke="black"
                        strokeDasharray="1, 5"
                        strokeWidth="0.5"
                    />
                    <line
                        x1="0"
                        y1={line}
                        x2={canvasWidth}
                        y2={line}
                        vectorEffect="non-scaling-stroke"
                        stroke="black"
                        strokeDasharray="1, 5"
                        strokeWidth="0.5"
                    />
                </g>
            );
        });
    }

    render() {
        const { showGrid } = this.props;
        return (
            <svg className="grid"
                display={showGrid ? "" : "none"}
            >
                {this.renderMajorLines()}
                {this.renderMinorLines()}
            </svg>
        );
    }
}

export default GridLayer;
