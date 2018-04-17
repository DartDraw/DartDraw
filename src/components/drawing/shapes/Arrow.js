import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { scaleViewBox } from '../../../reducers/utilities/arrow';
import { formatPoints } from '../../../utilities/shapes';
import { ARROW_GUI_HEIGHT } from '../../../constants';

class Arrow extends Component {
    static propTypes = {
        id: PropTypes.string,
        viewBox: PropTypes.array,
        scale: PropTypes.number,
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
        stroke: PropTypes.string,
        strokeWidth: PropTypes.number,
        strokeDasharray: PropTypes.string,
        // onDragStart: PropTypes.func,
        // onDrag: PropTypes.func,
        // onDragStop: PropTypes.func,
        // onClick: PropTypes.func,
        propagateEvents: PropTypes.bool
    }

    defaultProps = {
        propagateEvents: false
    }

    // constructor(props) {
    //     super(props);
    //
    //     // this.handleDragStart = this.handleDragStart.bind(this);
    //     // this.handleDrag = this.handleDrag.bind(this);
    //     // this.handleDragStop = this.handleDragStop.bind(this);
    //     // this.handleClick = this.handleClick.bind(this);
    // }

    // handleDragStart(id, draggableData) {
    //     const { onDragStart } = this.props;
    //     onDragStart && onDragStart(this.props.id, draggableData);
    // }
    //
    // handleDrag(id, draggableData) {
    //     const { onDrag } = this.props;
    //     onDrag && onDrag(this.props.id, draggableData);
    // }
    //
    // handleDragStop(id, draggableData) {
    //     const { onDragStop } = this.props;
    //     onDragStop && onDragStop(this.props.id, draggableData);
    // }
    //
    // handleClick(id, event) {
    //     const { onClick } = this.props;
    //     onClick && onClick(this.props.id, event);
    // }

    render() {
        const { scale, id, type, refX, points, cx, cy, rx, ry, x, y, width, height, stroke, strokeWidth, strokeDasharray } = this.props;
        const arrowProps = {
            fill: stroke,
            stroke,
            strokeWidth,
            strokeDasharray,
            vectorEffect: "non-scaling-stroke"
        };

        var arrow;
        var refY = ARROW_GUI_HEIGHT / 2;

        switch (type) {
            case "triangle":
            case "barbed":
                arrow = (
                    <polygon
                        {...arrowProps}
                        points={formatPoints(points)}
                        strokeWidth={0}
                    />
                );
                break;
            case "ellipse":
                arrow = (
                    <ellipse
                        {...arrowProps}
                        cx={cx}
                        cy={cy}
                        rx={rx}
                        ry={ry}
                        strokeWidth={0}
                    />
                );
                break;
            case "rectangle":
                arrow = (
                    <rect
                        {...arrowProps}
                        x={x}
                        y={y}
                        width={width}
                        height={height}
                        strokeWidth={0}
                    />
                );
                break;
            case "polyline":
                arrow = (
                    <polyline
                        {...arrowProps}
                        points={formatPoints(points)}
                        fillOpacity={0}
                    />
                );
                break;
            default: break;
        }

        return (
            <marker
                id={id}
                key={id + "_marker"}
                viewBox={scaleViewBox(3000, 1500, strokeWidth, scale)}
                orient="auto"
                markerWidth="3000"
                markerHeight="1500"
                markerUnits="userSpaceOnUse"
                refX={refX}
                refY={refY}
                // onDragStart={() => console.log("hi")}
                // onDrag={this.handleDrag}
                // onClick={() => console.log("hi")}>
            >
                {arrow}
            </marker>
        );
    }
}

export default Arrow;
