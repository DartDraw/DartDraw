import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DraggableCore } from 'react-draggable';
import './Canvas.css';
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
    }

    handleDragStart(e, draggableData) {
        this.props.onDragStart(draggableData);
    }

    handleDrag(e, draggableData) {
        this.props.onDrag(draggableData);
    }

    handleDragStop(e, draggableData) {
        this.props.onDragStop();
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

    handleUndoClick() {
        this.props.onUndoClick();
    }

    handleRedoClick() {
        this.props.onRedoClick();
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
                    return (
                        <Rectangle
                            key={i}
                            id={shape.id}
                            onDragStart={() => { console.log("drag start"); }}
                            onDrag={() => { console.log("draggin"); }}
                            onDragStop={() => { console.log("drag stop"); }}
                            width={shape.width}
                            height={shape.height}
                            x={shape.x}
                            y={shape.y}
                            stroke='rgba(102, 204, 255, 0.7)'
                            strokeWidth={8}
                            fill='rgba(0, 0, 0, 0)'
                        />
                    );
                default:
                    break;
            }
        });
    }

    render() {
        return (
            <div>
                <DraggableCore
                    onStart={this.handleDragStart}
                    onDrag={this.handleDrag}
                    onStop={this.handleDragStop}
                >
                    <svg className="Canvas" height="900" width="1200">
                        {this.renderDrawing()}
                    </svg>
                </DraggableCore>
            </div>
        );
    }
}

export default Canvas;
