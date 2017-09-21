import React, { Component } from 'react';
import clickdrag from 'react-clickdrag';
import PropTypes from 'prop-types';
import './Canvas.css';
import Shape from './Shape';

class Canvas extends Component {
    static propTypes = {
        shapes: PropTypes.array,
        dataDrag: PropTypes.object,
        onCanvasDragStart: PropTypes.func,
        onCanvasDrag: PropTypes.func,
        onCanvasDragStop: PropTypes.func,
        onUndoClick: PropTypes.func,
        onRedoClick: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.renderDrawing = this.renderDrawing.bind(this);
        this.handleCanvasDragStart = this.handleCanvasDragStart.bind(this);
        this.handleCanvasDrag = this.handleCanvasDrag.bind(this);
        this.handleCanvasDragStop = this.handleCanvasDragStop.bind(this);
        this.handleUndoClick = this.handleUndoClick.bind(this);
        this.handleRedoClick = this.handleRedoClick.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const dataDrag = this.props.dataDrag;
        const nextDataDrag = nextProps.dataDrag;
        if (!dataDrag.isMouseDown && nextDataDrag.isMouseDown) {
            this.handleCanvasDragStart({
                x: nextDataDrag.mouseDownPositionX,
                y: nextDataDrag.mouseDownPositionY
            });
        }

        const moveDeltaXChanged = dataDrag.moveDeltaX !== nextDataDrag.moveDeltaX;
        const moveDeltaYChanged = dataDrag.moveDeltaY !== nextDataDrag.moveDeltaY;
        if (moveDeltaXChanged && moveDeltaYChanged) {
            this.handleCanvasDrag(nextDataDrag);
        } else if (dataDrag.isMoving && !nextDataDrag.isMoving) {
            this.handleCanvasDragStop(nextDataDrag);
        }
    }

    handleCanvasDragStart({x, y}) {
        this.props.onCanvasDragStart({x, y});
    }

    handleCanvasDrag(dataDrag) {
        this.props.onCanvasDrag(dataDrag);
    }

    handleCanvasDragStop(dataDrag) {
        this.props.onCanvasDragStop(dataDrag);
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
                />
            );
        });
    }

    render() {
        return (
            <div>
                <button onClick={this.handleUndoClick}>UNDO</button>
                <button onClick={this.handleRedoClick}>REDO</button>
                <svg className="Canvas" height="900" width="1200">
                    {this.renderDrawing()}
                </svg>
            </div>
        );
    }
}

export default clickdrag(Canvas);
