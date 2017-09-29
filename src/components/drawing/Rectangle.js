import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Shape } from '.';

class Rectangle extends Component {
    static propTypes = {
        id: PropTypes.string,
        onDragStart: PropTypes.func,
        onDrag: PropTypes.func,
        onDragStop: PropTypes.func,
        width: PropTypes.number,
        height: PropTypes.number,
        x: PropTypes.number,
        y: PropTypes.number,
        stroke: PropTypes.string,
        strokeWidth: PropTypes.number,
        fill: PropTypes.string
    }

    constructor(props) {
        super(props);

        this.handleDragStart = this.handleDragStart.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
        this.handleDragStop = this.handleDragStop.bind(this);
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

    render() {
        const { id, width, height, x, y, stroke, strokeWidth, fill } = this.props;
        const rectProps = { width, height, x, y, stroke, strokeWidth, fill };

        return (
            <Shape
                id={id}
                onDragStart={this.handleDragStart}
                onDrag={this.handleDrag}
                onDragStop={this.handleDragStop}
            >
                <rect {...rectProps} />
            </Shape>
        );
    }
}

export default Rectangle;
