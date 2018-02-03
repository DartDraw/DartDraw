import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Ellipse } from '.';

class Control extends Component {
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
        transform: PropTypes.arrayOf(PropTypes.shape({
            command: PropTypes.string,
            parameters: PropTypes.arrayOf(PropTypes.number)
        })),
        propagateEvents: PropTypes.bool
    }

    constructor(props) {
        super(props);

        this.controlDragStart = this.controlDragStart.bind(this);
        this.controlDrag = this.controlDrag.bind(this);
        this.controlDragStop = this.controlDragStop.bind(this);
    }

    controlDragStart(id, draggableData) {
        const { shapeId, index, onDragStart } = this.props;
        onDragStart && onDragStart(shapeId, index, draggableData);
    }

    controlDrag(id, draggableData) {
        const { shapeId, index, onDrag } = this.props;
        onDrag && onDrag(shapeId, index, draggableData);
    }

    controlDragStop(id, draggableData) {
        const { shapeId, index, onDragStop } = this.props;
        onDragStop && onDragStop(shapeId, index, draggableData);
    }

    render() {
        const { id, x, y, width, height, strokeWidth, propagateEvents } = this.props;
        const ellipseProps = { cx: x, cy: y, rx: width / 2, ry: height / 2 };
        return (
            <Ellipse
                id={id}
                {...ellipseProps}
                height={height}
                width={width}
                strokeWidth={strokeWidth}
                stroke='rgba(69, 63, 80, 0.9)'
                fill='rgba(255, 255, 255, 1)'
                vectorEffect="non-scaling-stroke"
                onDragStart={this.controlDragStart}
                onDrag={this.controlDrag}
                onDragStop={this.controlDragStop}
                propagateEvents={propagateEvents}
            />
        );
    }
}

export default Control;
