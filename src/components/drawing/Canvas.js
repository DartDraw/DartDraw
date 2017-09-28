import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DraggableCore } from 'react-draggable';
import './Canvas.css';
import Shape from './Shape';

class Canvas extends Component {
    static propTypes = {
        shapes: PropTypes.array,
        onDragStart: PropTypes.func,
        onDrag: PropTypes.func,
        onDragStop: PropTypes.func,
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

    handleShapeDrag(shapeId, draggableData) {
        this.props.onShapeDrag(shapeId, draggableData);
    }

    handleShapeDragStop(shapeId, draggableData) {
        this.props.onShapeDragStop(shapeId);
    }

    handleUndoClick() {
        this.props.onUndoClick();
    }

    handleRedoClick() {
        this.props.onRedoClick();
    }

    renderDrawing() {
        const { shapes } = this.props;
        return shapes.map((shape) => {
            return (
                <Shape
                    width={shape.width}
                    height={shape.height}
                    x={shape.x}
                    y={shape.y}
                    id={shape.id}
                    key={shape.id}
                    onDrag={this.handleShapeDrag}
                    onDragStop={this.handleShapeDragStop}
                />
            );
        });
    }

    render() {
        return (
            <div>
                <button onClick={this.handleUndoClick}>UNDO</button>
                <button onClick={this.handleRedoClick}>REDO</button>
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
