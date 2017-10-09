import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Draggable } from '../shared';

class Shape extends Component {
    static propTypes = {
        id: PropTypes.string,
        children: PropTypes.any,
        onDragStart: PropTypes.func,
        onDrag: PropTypes.func,
        onDragStop: PropTypes.func,
        onClick: PropTypes.func
    }

    constructor(props) {
        super(props);

        this.handleDragStart = this.handleDragStart.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
        this.handleDragStop = this.handleDragStop.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleDragStart(draggableData) {
        const { id, onDragStart } = this.props;
        onDragStart && onDragStart(id, draggableData);
    }

    handleDrag(draggableData) {
        const { id, onDrag } = this.props;
        onDrag && onDrag(id, draggableData);
    }

    handleDragStop(draggableData) {
        const { id, onDragStop } = this.props;
        onDragStop && onDragStop(id, draggableData);
    }

    handleClick(e) {
        const { id, onClick } = this.props;
        e.stopPropagation();
        onClick && onClick(id, e.nativeEvent);
    }

    render() {
        const { children } = this.props;

        return (
            <Draggable
                onStart={this.handleDragStart}
                onDrag={this.handleDrag}
                onStop={this.handleDragStop}
                onMouseDown={this.handleClick}
            >
                {React.cloneElement(children, { onClick: this.handleClick })}
            </Draggable>
        );
    }
}

export default Shape;
