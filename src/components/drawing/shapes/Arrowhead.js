import React, { Component } from 'react';
import PropTypes from 'prop-types';

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
        const { arrowId, arrowType, stroke, strokeDasharray } = this.props;
        const arrowheadProps = {
            strokeDasharray: strokeDasharray,
            vectorEffect: "non-scaling-stroke"
        };

        var arrowhead, refX, refY;

        switch (arrowType) {
            case "triangle":
                refX = 0;
                refY = 4;
                arrowhead = (
                    <path
                        d="M 0 0 L 8 4 L 0 8 z"
                        fill={stroke}
                        {...arrowheadProps}
                    />
                );
                break;
            case "barbed":
                refX = 2;
                refY = 4;
                arrowhead = (
                    <path
                        d="M 0 0 L 10 4 L 0 8 L 2 4 z"
                        fill={stroke}
                        {...arrowheadProps}
                    />
                );
                break;
            case "ellipse":
                refX = 0;
                refY = 4;
                arrowhead = (
                    <circle
                        cx="4"
                        cy="4"
                        r="4"
                        fill={stroke}
                        {...arrowheadProps}
                    />
                );
                break;
            case "rectangle":
                refX = 0;
                refY = 4;
                arrowhead = (
                    <path
                        d="M 0 0 L 8 0 L 8 8 L 0 8 z"
                        fill={stroke}
                        {...arrowheadProps}
                    />
                );
                break;
            case "polyline":
                refX = 8;
                refY = 4;
                arrowhead = (
                    <path
                        d="M 0 0 L 8 4 L 0 8"
                        fill="none"
                        stroke={stroke}
                        {...arrowheadProps}
                    />
                );
                break;
            default:
        }

        return (
            <marker id={arrowId} key={arrowId + "_marker"} orient="auto"
                markerWidth="20" markerHeight="20"
                refX={refX} refY={refY} >
                onDragStart={() => console.log("hi")}
                onDrag={this.handleDrag}
                onDragStop={this.handleDragStop}
                onClick={() => console.log("hi")}>
                {arrowhead}
            </marker>
        );
    }
}

export default Arrowhead;
