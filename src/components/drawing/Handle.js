import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Rectangle } from '.';

class Handle extends Component {
    static propTypes = {
        id: PropTypes.string,
        shapeId: PropTypes.string,
        index: PropTypes.number,
        onDragStart: PropTypes.func,
        onDrag: PropTypes.func,
        onDragStop: PropTypes.func,
        x: PropTypes.number,
        y: PropTypes.number,
        width: PropTypes.number,
        height: PropTypes.number,
        strokeWidth: PropTypes.number,
        propagateEvents: PropTypes.bool
    }

    constructor(props) {
        super(props);

        this.handleDragStart = this.handleDragStart.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
        this.handleDragStop = this.handleDragStop.bind(this);
    }

    handleDragStart(id, draggableData) {
        const { shapeId, index, onDragStart } = this.props;
        onDragStart && onDragStart(shapeId, index, draggableData);
    }

    handleDrag(id, draggableData) {
        const { shapeId, index, onDrag } = this.props;
        onDrag && onDrag(shapeId, index, draggableData);
    }

    handleDragStop(id, draggableData) {
        const { shapeId, index, onDragStop } = this.props;
        onDragStop && onDragStop(shapeId, index, draggableData);
    }

    render() {
        const { id, x, y, width, height, strokeWidth, propagateEvents } = this.props;
        const rectProps = { x, y };

        return (
            <Rectangle
                id={id}
                {...rectProps}
                width={width}
                height={height}
                strokeWidth={strokeWidth}
                stroke='rgba(69, 63, 80, 0.9)'
                fill='rgba(255, 255, 255, 1)'
                onDragStart={this.handleDragStart}
                onDrag={this.handleDrag}
                onDragStop={this.handleDragStop}
                propagateEvents={propagateEvents}
            />
        );
    }
}

export default Handle;
