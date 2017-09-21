import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Canvas.css';
import Shape from './Shape';

class Canvas extends Component {
    static propTypes = {
        shapes: PropTypes.array,
        onCanvasClick: PropTypes.func,
        onUndoClick: PropTypes.func,
        onRedoClick: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.renderDrawing = this.renderDrawing.bind(this);
        this.handleCanvasClick = this.handleCanvasClick.bind(this);
        this.handleUndoClick = this.handleUndoClick.bind(this);
        this.handleRedoClick = this.handleRedoClick.bind(this);
    }

    handleCanvasClick(e) {
        const { offsetX, offsetY } = e.nativeEvent;
        this.props.onCanvasClick({
            height: 50,
            width: 50,
            x: offsetX,
            y: offsetY
        });
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
                <svg className="Canvas" height="900" width="1200" onClick={this.handleCanvasClick}>
                    {this.renderDrawing()}
                </svg>
            </div>
        );
    }
}

export default Canvas;
