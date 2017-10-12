import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Group extends Component {
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

    handleDragStart(shapeId, draggableData) {
        const { id, onDragStart } = this.props;
        onDragStart && onDragStart(id, draggableData);
    }

    handleDrag(shapeId, draggableData) {
        const { id, onDrag } = this.props;
        onDrag && onDrag(id, draggableData);
    }

    handleDragStop(shapeId, draggableData) {
        const { id, onDragStop } = this.props;
        onDragStop && onDragStop(id, draggableData);
    }

    handleClick(shapeId, event) {
        const { id, onClick } = this.props;
        onClick && onClick(id, event);
    }

    render() {
        const { children } = this.props;
        return (
            <g>
                {React.Children.map(children, (child) => {
                    return React.cloneElement(child, {
                        onDragStart: this.handleDragStart,
                        onDrag: this.handleDrag,
                        onDragStop: this.handleDragStop,
                        onClick: this.handleClick
                    });
                })}
            </g>
        );
    }
}

export default Group;
