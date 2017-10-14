import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Canvas.css';
import { Draggable } from '../shared';
import { Group, Rectangle, Handle } from '.';

class Canvas extends Component {
    static propTypes = {
        shapes: PropTypes.array,
        onDragStart: PropTypes.func,
        onDrag: PropTypes.func,
        onDragStop: PropTypes.func,
        onShapeDragStart: PropTypes.func,
        onShapeDrag: PropTypes.func,
        onShapeDragStop: PropTypes.func,
        onShapeClick: PropTypes.func,
        onGroupDragStart: PropTypes.func,
        onGroupDrag: PropTypes.func,
        onGroupDragStop: PropTypes.func,
        onGroupClick: PropTypes.func,
        onHandleDragStart: PropTypes.func,
        onHandleDrag: PropTypes.func,
        onHandleDragStop: PropTypes.func,
        onUndoClick: PropTypes.func,
        onRedoClick: PropTypes.func,
        propagateEvents: PropTypes.bool
    };

    constructor(props) {
        super(props);
        this.renderDrawing = this.renderDrawing.bind(this);
        this.handleUndoClick = this.handleUndoClick.bind(this);
        this.handleRedoClick = this.handleRedoClick.bind(this);
        this.handleDragStart = this.handleDragStart.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
        this.handleDragStop = this.handleDragStop.bind(this);
        this.handleShapeDragStart = this.handleShapeDragStart.bind(this);
        this.handleShapeDrag = this.handleShapeDrag.bind(this);
        this.handleShapeDragStop = this.handleShapeDragStop.bind(this);
        this.handleShapeClick = this.handleShapeClick.bind(this);
        this.handleGroupDragStart = this.handleGroupDragStart.bind(this);
        this.handleGroupDrag = this.handleGroupDrag.bind(this);
        this.handleGroupDragStop = this.handleGroupDragStop.bind(this);
        this.handleGroupClick = this.handleGroupClick.bind(this);
        this.handleHandleDragStart = this.handleHandleDragStart.bind(this);
        this.handleHandleDrag = this.handleHandleDrag.bind(this);
        this.handleHandleDragStop = this.handleHandleDragStop.bind(this);
    }

    handleDragStart(draggableData) {
        this.props.onDragStart(draggableData);
    }

    handleDrag(draggableData) {
        this.props.onDrag(draggableData);
    }

    handleDragStop(draggableData) {
        this.props.onDragStop(draggableData);
    }

    handleShapeDragStart(shapeId, draggableData) {
        this.props.onShapeDragStart(shapeId, draggableData);
    }

    handleShapeDrag(shapeId, draggableData) {
        this.props.onShapeDrag(shapeId, draggableData);
    }

    handleShapeDragStop(shapeId, draggableData) {
        this.props.onShapeDragStop(shapeId, draggableData);
    }

    handleShapeClick(shapeId, event) {
        this.props.onShapeClick(shapeId, event);
    }

    handleGroupDragStart(groupId, draggableData) {
        this.props.onGroupDragStart(groupId, draggableData);
    }

    handleGroupDrag(groupId, draggableData) {
        this.props.onGroupDrag(groupId, draggableData);
    }

    handleGroupDragStop(groupId, draggableData) {
        this.props.onGroupDragStop(groupId, draggableData);
    }

    handleGroupClick(groupId, event) {
        this.props.onGroupClick(groupId, event);
    }

    handleHandleDragStart(shapeId, handleIndex, draggableData) {
        this.props.onHandleDragStart(shapeId, handleIndex, draggableData);
    }

    handleHandleDrag(shapeId, handleIndex, draggableData) {
        this.props.onHandleDrag(shapeId, handleIndex, draggableData);
    }

    handleHandleDragStop(shapeId, handleIndex, draggableData) {
        this.props.onHandleDragStop(shapeId, handleIndex, draggableData);
    }

    handleUndoClick() {
        this.props.onUndoClick();
    }

    handleRedoClick() {
        this.props.onRedoClick();
    }

    renderHandles(shape) {
        const { propagateEvents } = this.props;
        return [0, 1, 2, 3].map((index) => {
            let x = shape.x - 3;
            let y = shape.y - 3;
            if (index === 0 || index === 1) {
                x = x + shape.width - 3;
            }
            if (index === 1 || index === 2) {
                y = y + shape.height - 3;
            }
            return (
                <Handle
                    key={shape.id + index}
                    id={shape.id}
                    shapeId={shape.shapeId}
                    index={index}
                    x={x}
                    y={y}
                    onDragStart={this.handleHandleDragStart}
                    onDrag={this.handleHandleDrag}
                    onDragStop={this.handleHandleDragStop}
                    propagateEvents={propagateEvents}
                />
            );
        });
    }

    renderShape(shape) {
        const { propagateEvents } = this.props;
        switch (shape.type) {
            case 'group':
                const groupMembers = shape.members.map((shape) => {
                    return this.renderShape(shape);
                });
                return (
                    <Group
                        key={shape.id}
                        id={shape.id}
                        onDragStart={this.handleGroupDragStart}
                        onDrag={this.handleGroupDrag}
                        onDragStop={this.handleGroupDragStop}
                        onClick={this.handleGroupClick}
                    >
                        {groupMembers}
                    </Group>
                );
            case 'rectangle':
                return (
                    <Rectangle
                        key={shape.id}
                        id={shape.id}
                        onDragStart={this.handleShapeDragStart}
                        onDrag={this.handleShapeDrag}
                        onDragStop={this.handleShapeDragStop}
                        onClick={this.handleShapeClick}
                        {...shape}
                        propagateEvents={propagateEvents}
                    />
                );
            case 'selectionBox':
                return (
                    <g key={shape.id}>
                        <Rectangle
                            x={shape.x - 1}
                            y={shape.y - 1}
                            width={shape.width + 2}
                            height={shape.height + 2}
                            stroke='rgba(102, 204, 255, 0.7)'
                            strokeWidth={2}
                            fill='none'
                            propagateEvents={propagateEvents}
                        />
                        {this.renderHandles(shape)}
                    </g>
                );
            default:
                break;
        }
    }

    renderDrawing() {
        const { shapes } = this.props;
        return shapes.map((shape) => {
            return this.renderShape(shape);
        });
    }

    render() {
        return (
            <div>
                <Draggable
                    onStart={this.handleDragStart}
                    onDrag={this.handleDrag}
                    onStop={this.handleDragStop}
                >
                    <svg className="Canvas" height="95vh" width="1200">
                        {this.renderDrawing()}
                    </svg>
                </Draggable>
            </div>
        );
    }
}

export default Canvas;
