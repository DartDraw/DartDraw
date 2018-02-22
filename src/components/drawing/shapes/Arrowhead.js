import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Polygon } from '.';
import { formatPoints, formatPath } from '../../../utilities/shapes';

class Arrowhead extends Component {
    static propTypes = {
        id: PropTypes.string,
        arrowId: PropTypes.string,
        arrowType: PropTypes.string,
        onDragStart: PropTypes.func,
        onDrag: PropTypes.func,
        onDragStop: PropTypes.func,
        onClick: PropTypes.func,
        points: PropTypes.arrayOf(PropTypes.number),
        stroke: PropTypes.string,
        strokeWidth: PropTypes.number,
        strokeDasharray: PropTypes.string,
        fill: PropTypes.string,
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
        const { arrowId, arrowType, stroke, strokeWidth, strokeDasharray } = this.props;
        const arrowheadProps = {
            fill: stroke,
            stroke: stroke,
            strokeWidth: strokeWidth,
            strokeDasharray: strokeDasharray,
            vectorEffect: "non-scaling-stroke"
        };

        var arrowhead;
        var refX;
        var refY = 75;

        switch (arrowType) {
            case "triangle":
                refX = 215;
                arrowhead = (
                    <polygon
                        points={formatPoints([215, 55, 275, 75, 215, 95])}
                        {...arrowheadProps}
                    />
                );
                break;
            case "barbed":
                refX = 235;
                arrowhead = (
                    <polygon
                        points={formatPoints([215, 55, 275, 75, 215, 95, 235, 75])}
                        {...arrowheadProps}
                    />
                );
                break;
            case "ellipse":
                refX = 245;
                arrowhead = (
                    <ellipse
                        cx="260"
                        cy="75"
                        rx="15"
                        ry="15"
                        {...arrowheadProps}
                    />
                );
                break;
            case "rectangle":
                refX = 245;
                arrowhead = (
                    <rect
                        x="245"
                        y="60"
                        width="30"
                        height="30"
                        {...arrowheadProps}
                    />
                );
                break;
            case "polyline":
                refX = 275;
                arrowhead = (
                    <polyline
                        points={formatPoints([215, 55, 275, 75, 215, 95])}
                        fillOpacity="0"
                        {...arrowheadProps}
                    />
                );
                break;
            default: break;
        }

        return (
            <marker
                id={arrowId}
                key={arrowId + "_marker"}
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
