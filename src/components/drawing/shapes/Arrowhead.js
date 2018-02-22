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

        var arrowhead, refX, refY;

        switch (arrowType) {
            case "triangle":
                refX = 0;
                refY = 20;
                arrowhead = (
                    <polygon
                        points={formatPoints([0, 0, 60, 20, 0, 40])}
                        {...arrowheadProps}
                    />
                );
                break;
            case "barbed":
                refX = 20;
                refY = 20;
                arrowhead = (
                    <polygon
                        points={formatPoints([0, 0, 60, 20, 0, 40, 20, 20])}
                        {...arrowheadProps}
                    />
                );
                break;
            case "ellipse":
                refX = 0;
                refY = 15;
                arrowhead = (
                    <ellipse
                        cx="15"
                        cy="15"
                        rx="15"
                        ry="15"
                        {...arrowheadProps}
                    />
                );
                break;
            case "rectangle":
                refX = 0;
                refY = 15;
                arrowhead = (
                    <rect
                        x="0"
                        y="0"
                        width="30"
                        height="30"
                        {...arrowheadProps}
                    />
                );
                break;
            case "polyline":
                refX = 60;
                refY = 20;
                arrowhead = (
                    <polyline
                        points={formatPoints([0, 0, 60, 20, 0, 40])}
                        fillOpacity="0"
                        {...arrowheadProps}
                    />
                );
                break;
            // case "barbed":
            //     refX = 2;
            //     refY = 4;
            //     arrowhead = (
            //         <path
            //             d="M 0 0 L 10 4 L 0 8 L 2 4 z"
            //             fill={stroke}
            //             {...arrowheadProps}
            //         />
            //     );
            //     break;
            // case "ellipse":
            //     refX = 0;
            //     refY = 4;
            //     arrowhead = (
            //         <circle
            //             cx="4"
            //             cy="4"
            //             r="4"
            //             fill={stroke}
            //             {...arrowheadProps}
            //         />
            //     );
            //     break;
            // case "rectangle":
            //     refX = 0;
            //     refY = 4;
            //     arrowhead = (
            //         <path
            //             d="M 0 0 L 8 0 L 8 8 L 0 8 z"
            //             fill={stroke}
            //             {...arrowheadProps}
            //         />
            //     );
            //     break;
            // case "polyline":
            //     refX = 8;
            //     refY = 4;
            //     arrowhead = (
            //         <path
            //             d="M 0 0 L 8 4 L 0 8"
            //             fill="none"
            //             stroke={stroke}
            //             {...arrowheadProps}
            //         />
            //     );
            //     break;
            default: break;
        }

        return (
            <marker
                id={arrowId}
                key={arrowId + "_marker"}
                orient="auto"
                markerWidth="100"
                markerHeight="100"
                markerUnits="userSpaceOnUse"
                refX={refX}
                refY={refY}
            >
                {arrowhead}
            </marker>
        );
    }
}

export default Arrowhead;

// <marker id={arrowId} key={arrowId + "_marker"} orient="auto"
//     markerWidth="20" markerHeight="20"
//     refX={refX} refY={refY} >
//     onDragStart={() => console.log("hi")}
//     onDrag={this.handleDrag}
//     onDragStop={this.handleDragStop}
//     onClick={() => console.log("hi")}>
//     {arrowhead}
// </marker>
