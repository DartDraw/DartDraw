import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DraggableCore } from 'react-draggable';

class Shape extends Component {
    static propTypes = {
        id: PropTypes.string,
        children: PropTypes.any,
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
        const { id, onDragStart } = this.props;
        e.stopPropagation();
        onDragStart && onDragStart(id, draggableData);
    }

    handleDrag(e, draggableData) {
        const { id, onDrag } = this.props;
        e.stopPropagation();
        onDrag && onDrag(id, draggableData);
    }

    handleDragStop(e, draggableData) {
        const { id, onDragStop } = this.props;
        e.stopPropagation();
        onDragStop && onDragStop(id, draggableData);
    }

    render() {
        const { children } = this.props;

        return (
            <DraggableCore
                onClick={this.handeClick}
                onStart={this.handleDragStart}
                onDrag={this.handleDrag}
                onStop={this.handleDragStop}
            >
                {children}
            </DraggableCore>
        );
    }
}

export default Shape;
