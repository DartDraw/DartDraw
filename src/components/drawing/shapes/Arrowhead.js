import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { formatPoints } from '../../../utilities/shapes';

class Arrowhead extends Component {
    static propTypes = {
        id: PropTypes.string,
        type: PropTypes.string,
        points: PropTypes.array,
        cx: PropTypes.number,
        cy: PropTypes.number,
        rx: PropTypes.number,
        ry: PropTypes.number,
        x: PropTypes.number,
        y: PropTypes.number,
        width: PropTypes.number,
        height: PropTypes.number,
        refX: PropTypes.number,
        length: PropTypes.number,
        stroke: PropTypes.string,
        strokeWidth: PropTypes.number,
        strokeDasharray: PropTypes.string,
        fillOpacity: PropTypes.number,
        onDragStart: PropTypes.func,
        onDrag: PropTypes.func,
        onDragStop: PropTypes.func,
        onClick: PropTypes.func,
        propagateEvents: PropTypes.bool
    }

    defaultProps = {
        propagateEvents: false
    }

    constructor(props) {
        super(props);

        this.handleDragStart = this.handleDragStart.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
        this.handleDragStop = this.handleDragStop.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleDragStart(id, draggableData) {
        const { onDragStart } = this.props;
        onDragStart && onDragStart(this.props.id, draggableData);
    }

    handleDrag(id, draggableData) {
        const { onDrag } = this.props;
        onDrag && onDrag(this.props.id, draggableData);
    }

    handleDragStop(id, draggableData) {
        const { onDragStop } = this.props;
        onDragStop && onDragStop(this.props.id, draggableData);
    }

    handleClick(id, event) {
        const { onClick } = this.props;
        onClick && onClick(this.props.id, event);
    }

    render() {
        const { id, type, refX, points, cx, cy, rx, ry, x, y, width, height, stroke, strokeWidth, strokeDasharray, fillOpacity } = this.props;
        const arrowheadProps = {
            fill: stroke,
            fillOpacity,
            stroke,
            strokeWidth,
            strokeDasharray
        };

        var arrowhead;
        var refY = 75;

        switch (type) {
            case "triangle":
            case "barbed":
                arrowhead = (
                    <polygon
                        points={formatPoints(points)}
                        {...arrowheadProps}
                    />
                );
                break;
            case "ellipse":
                arrowhead = (
                    <ellipse
                        cx={cx}
                        cy={cy}
                        rx={rx}
                        ry={ry}
                        {...arrowheadProps}
                    />
                );
                break;
            case "rectangle":
                arrowhead = (
                    <rect
                        x={x}
                        y={y}
                        width={width}
                        height={height}
                        {...arrowheadProps}
                    />
                );
                break;
            case "polyline":
                arrowhead = (
                    <polyline
                        points={formatPoints(points)}
                        fillOpacity="0"
                        {...arrowheadProps}
                    />
                );
                break;
            default: break;
        }

        return (
            <marker
                id={id}
                key={id + "_marker"}
                orient="auto"
                markerWidth="300"
                markerHeight="150"
                markerUnits="userSpaceOnUse"
                refX={refX}
                refY={refY}
                onDragStart={() => console.log("hi")}
                onDrag={this.handleDrag}
                onClick={() => console.log("hi")}>
            >
                {arrowhead}
            </marker>
        );
    }
}

export default Arrowhead;
