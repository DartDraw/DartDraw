import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Shape } from '.';
import { formatTransform } from '../../../utilities/shapes';

class Rectangle extends Component {
    static propTypes = {
        id: PropTypes.string,
        onDragStart: PropTypes.func,
        onDrag: PropTypes.func,
        onDragStop: PropTypes.func,
        onClick: PropTypes.func,
        width: PropTypes.number,
        height: PropTypes.number,
        x: PropTypes.number,
        y: PropTypes.number,
        rx: PropTypes.number,
        ry: PropTypes.number,
        stroke: PropTypes.string,
        strokeWidth: PropTypes.number,
        strokeDasharray: PropTypes.string,
        vectorEffect: PropTypes.string,
        fill: PropTypes.string,
        fillOpacity: PropTypes.number,
        transform: PropTypes.arrayOf(PropTypes.shape({
            command: PropTypes.string,
            parameters: PropTypes.arrayOf(PropTypes.number)
        })),
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
        onDragStart && onDragStart(id, draggableData);
    }

    handleDrag(id, draggableData) {
        const { onDrag } = this.props;
        onDrag && onDrag(id, draggableData);
    }

    handleDragStop(id, draggableData) {
        const { onDragStop } = this.props;
        onDragStop && onDragStop(id, draggableData);
    }

    handleClick(id, event) {
        const { onClick } = this.props;
        onClick && onClick(id, event);
    }

    render() {
        const {
            id,
            width,
            height,
            x,
            y,
            rx,
            ry,
            stroke,
            strokeWidth,
            strokeDasharray,
            fill,
            fillOpacity,
            transform,
            propagateEvents
        } = this.props;

        const svgProps = {
            id,
            stroke,
            strokeWidth,
            strokeDasharray,
            fill,
            fillOpacity,
            transform: formatTransform(transform),
            vectorEffect: 'non-scaling-stroke',
            rx,
            ry
        };

        return (
            <Shape
                id={id}
                onDragStart={this.handleDragStart}
                onDrag={this.handleDrag}
                onDragStop={this.handleDragStop}
                onClick={this.handleClick}
                propagateEvents={propagateEvents}
            >
                <rect
                    x={width < 0 ? x + width : x}
                    y={height < 0 ? y + height : y}
                    width={Math.abs(width)}
                    height={Math.abs(height)}
                    {...svgProps}
                />
            </Shape>
        );
    }
}

export default Rectangle;
