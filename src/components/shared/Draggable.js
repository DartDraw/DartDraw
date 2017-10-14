import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DraggableCore } from 'react-draggable';

class Draggable extends Component {
    static propTypes = {
        children: PropTypes.any,
        onStart: PropTypes.func,
        onDrag: PropTypes.func,
        onStop: PropTypes.func,
        propagateEvents: PropTypes.bool
    }

    static defaultProps = {
        propagateEvents: false
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
        const { onStart, propagateEvents } = this.props;
        if (!propagateEvents) {
            e.stopPropagation();
        }
        this.setState({
            originX: draggableData.x,
            originY: draggableData.y
        });
        onStart && onStart(draggableData);
    }

    handleDrag(e, draggableData) {
        const { onDrag, propagateEvents } = this.props;
        const { originX, originY } = this.state;
        if (!propagateEvents) {
            e.stopPropagation();
        }
        draggableData.originX = originX;
        draggableData.originY = originY;
        onDrag && onDrag(draggableData);
    }

    handleDragStop(e, draggableData) {
        const { onStop, propagateEvents } = this.props;
        if (!propagateEvents) {
            e.stopPropagation();
        }
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
