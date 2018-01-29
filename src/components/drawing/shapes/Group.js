import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { formatTransform } from '../../../utilities/shapes';

class Group extends Component {
    static propTypes = {
        id: PropTypes.string,
        children: PropTypes.any,
        onDragStart: PropTypes.func,
        onDrag: PropTypes.func,
        onDragStop: PropTypes.func,
        onClick: PropTypes.func,
        transform: PropTypes.arrayOf(PropTypes.shape({
            command: PropTypes.string,
            parameters: PropTypes.arrayOf(PropTypes.number)
        }))
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
        draggableData.node = draggableData.node.parentNode;
        onDragStart && onDragStart(id, draggableData);
    }

    handleDrag(shapeId, draggableData) {
        const { id, onDrag } = this.props;
        draggableData.node = draggableData.node.parentNode;
        onDrag && onDrag(id, draggableData);
    }

    handleDragStop(shapeId, draggableData) {
        const { id, onDragStop } = this.props;
        draggableData.node = draggableData.node.parentNode;
        onDragStop && onDragStop(id, draggableData);
    }

    handleClick(shapeId, event) {
        const { id, onClick } = this.props;
        onClick && onClick(id, event);
    }

    render() {
        const { children, id, transform } = this.props;
        return (
            <g id={id} transform={formatTransform(transform)}>
                {React.Children.map(children, (child) => {
                    if (child.props.className === 'line') {
                        child = child.props.children[0];
                    }
                    return React.cloneElement(child, {
                        onDragStart: this.handleDragStart,
                        onDrag: this.handleDrag,
                        onDragStop: this.handleDragStop,
                        onClick: this.handleClick
                    });
                })}

                // transparent lines
                {React.Children.map(children, (child) => {
                    if (child && child.props.className === 'line') {
                        return React.cloneElement(child.props.children[1], {
                            onDragStart: this.handleDragStart,
                            onDrag: this.handleDrag,
                            onDragStop: this.handleDragStop,
                            onClick: this.handleClick
                        });
                    }
                })}
            </g>
        );
    }
}

export default Group;
