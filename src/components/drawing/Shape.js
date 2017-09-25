import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DraggableCore } from 'react-draggable';

class Shape extends Component {
    static propTypes = {
        id: PropTypes.object,
        width: PropTypes.number,
        height: PropTypes.number,
        x: PropTypes.number,
        y: PropTypes.number,
        onDragStart: PropTypes.func,
        onDrag: PropTypes.func,
        onDragStop: PropTypes.func
    }

    constructor(props) {
        super(props);

        this.handleDragStart = this.handleDragStart.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
        this.handleDragStop = this.handleDragStop.bind(this);
    }

    handleDragStart(e, draggableData) {
        e.stopPropagation();
        this.props.onDragStart(draggableData);
    }

    handleDrag(e, draggableData) {
        e.stopPropagation();
        this.props.onDrag(draggableData);
    }

    handleDragStop(e, draggableData) {
        e.stopPropagation();
        this.props.onDragStop();
    }

    render() {
        const { width, height, x, y } = this.props;

        return (
            <DraggableCore
                onStart={this.handleDragStart}
                onDrag={this.handleDrag}
                onStop={this.handleDragStop}
            >
                <rect
                    width={width}
                    height={height}
                    x={x}
                    y={y}
                />
            </DraggableCore>
        );
    }
}

export default Shape;
