import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DraggableCore } from 'react-draggable';

class Draggable extends Component {
    static propTypes = {
        children: PropTypes.any,
        onStart: PropTypes.func,
        onDrag: PropTypes.func,
        onStop: PropTypes.func
    }

    constructor(props) {
        super(props);

        this.state = {
            originX: null,
            originY: null
        };

        this.handleDragStart = this.handleDragStart.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
        this.handleDragStop = this.handleDragStop.bind(this);
    }

    handleDragStart(e, draggableData) {
        e.stopPropagation();
        const { onStart } = this.props;
        this.setState({
            originX: draggableData.x,
            originY: draggableData.y
        });
        onStart && onStart(draggableData);
    }

    handleDrag(e, draggableData) {
        e.stopPropagation();
        const { onDrag } = this.props;
        const { originX, originY } = this.state;
        draggableData.originX = originX;
        draggableData.originY = originY;
        onDrag && onDrag(draggableData);
    }

    handleDragStop(e, draggableData) {
        e.stopPropagation();
        const { onStop } = this.props;
        this.setState({
            originX: null,
            originY: null
        });
        onStop && onStop(draggableData);
    }

    render() {
        const { children } = this.props;

        return (
            <DraggableCore
                onStart={this.handleDragStart}
                onDrag={this.handleDrag}
                onStop={this.handleDragStop}
            >
                {children}
            </DraggableCore>
        );
    }
}

export default Draggable;
