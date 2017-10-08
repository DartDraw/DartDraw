import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Canvas.css';
import { Draggable } from '../shared';
import { Rectangle } from '.';

class Canvas extends Component {
    static propTypes = {
        shapes: PropTypes.array,
        onDragStart: PropTypes.func,
        onDrag: PropTypes.func,
        onDragStop: PropTypes.func,
        onShapeDragStart: PropTypes.func,
        onShapeDrag: PropTypes.func,
        onShapeDragStop: PropTypes.func,
        onResizeHandleDragStart: PropTypes.func,
        onResizeHandleDrag: PropTypes.func,
        onResizeHandleDragStop: PropTypes.func,
        onUndoClick: PropTypes.func,
        onRedoClick: PropTypes.func
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
        this.handleResizeHandleDragStart = this.handleResizeHandleDragStart.bind(this);
        this.handleResizeHandleDrag = this.handleResizeHandleDrag.bind(this);
        this.handleResizeHandleDragStop = this.handleResizeHandleDragStop.bind(this);
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

    handleResizeHandleDragStart(shapeId, draggableData) {
        this.props.onResizeHandleDragStart(shapeId, draggableData);
    }

    handleResizeHandleDrag(shapeId, draggableData) {
        this.props.onResizeHandleDrag(shapeId, draggableData);
    }

    handleResizeHandleDragStop(shapeId, draggableData) {
        this.props.onResizeHandleDragStop(shapeId, draggableData);
    }

    handleUndoClick() {
        this.props.onUndoClick();
    }

    handleRedoClick() {
        this.props.onRedoClick();
    }

    renderResizeHandles(shape) {
        return [1, 2, 3, 4].map((i) => {
            let x = shape.x - 3;
            let y = shape.y - 3;
            if (i === 2 || i === 3) {
                x = x + shape.width - 3;
            }
            if (i === 3 || i === 4) {
                y = y + shape.height - 3;
            }
            return (
                <Rectangle
                    key={shape.id + i.toString()}
                    id={shape.id}
                    width={10}
                    height={10}
                    x={x}
                    y={y}
                    stroke='rgba(69, 63, 80, 0.9)'
                    fill='rgba(255, 255, 255, 1)'
                    onDragStart={this.handleResizeHandleDragStart}
                    onDrag={this.handleResizeHandleDrag}
                    onDragStop={this.handleResizeHandleDragStop}
                />
            );
        });
    }

    renderDrawing() {
        const { shapes } = this.props;
        return shapes.map((shape, i) => {
            switch (shape.type) {
                case 'rectangle':
                    return (
                        <Rectangle
                            key={shape.id}
                            id={shape.id}
                            onDragStart={this.handleShapeDragStart}
                            onDrag={this.handleShapeDrag}
                            onDragStop={this.handleShapeDragStop}
                            width={shape.width}
                            height={shape.height}
                            x={shape.x}
                            y={shape.y}
                        />
                    );
                case 'selectionBox':
                    const start = 'M ' + (shape.x - 1) + ' ' + (shape.y - 1);
                    const right = ' h ' + (shape.width + 2);
                    const down = ' v ' + (shape.height + 2);
                    const left = ' h ' + -(shape.width + 2);
                    const close = ' Z';
                    const pathData = start + right + down + left + close;
                    return (
                        <g key={shape.id}>
                            <path
                                d={pathData}
                                stroke='rgba(102, 204, 255, 0.7)'
                                strokeWidth={3}
                                fill='none'
                            />
                            {this.renderResizeHandles(shape)}
                        </g>
                    );
                default:
                    break;
            }
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
                    <svg className="Canvas" height="900" width="1200">
                        {this.renderDrawing()}
                    </svg>
                </Draggable>
            </div>
        );
    }
}

export default Canvas;
