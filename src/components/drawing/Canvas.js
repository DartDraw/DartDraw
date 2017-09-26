import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DraggableCore } from 'react-draggable';
import './Canvas.css';
import Shape from './Shape';

class Canvas extends Component {
    static propTypes = {
        shapes: PropTypes.array,
        dataDrag: PropTypes.object,
        onDragStart: PropTypes.func,
        onDrag: PropTypes.func,
        onDragStop: PropTypes.func,
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

    handleUndoClick() {
        this.props.onUndoClick();
    }

    handleRedoClick() {
        this.props.onRedoClick();
    }

    renderDrawing() {
        const { shapes } = this.props;
        return shapes.map(function(shape) {
            return (
                <Shape
                    width={shape.width}
                    height={shape.height}
                    x={shape.x}
                    y={shape.y}
                    id={shape.id}
                    key={shape.id}
                    onDragStart={() => { console.log("drag start"); }}
                    onDrag={() => { console.log("draggin"); }}
                    onDragStop={() => { console.log("drag stop"); }}
                />
            );
        });
    }

    render() {
        return (
            <div>
                <button onClick={this.handleUndoClick}>UNDO</button>
                <button onClick={this.handleRedoClick}>REDO</button>
<<<<<<< HEAD
                <svg className="Canvas" height="900" width="1200">
                    {this.renderDrawing()}
                </svg>
                <span>Error message</span>
=======
                <DraggableCore
                    onStart={this.handleDragStart}
                    onDrag={this.handleDrag}
                    onStop={this.handleDragStop}
                >
                    <svg className="Canvas" height="900" width="1200">
                        {this.renderDrawing()}
                    </svg>
                </DraggableCore>
>>>>>>> e2cf573e76d594a72cb5c7a27c6d05a7f5e36179
            </div>
        );
    }
}

export default Canvas;
