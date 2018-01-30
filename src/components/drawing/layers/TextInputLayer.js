import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextInput } from '../shapes';

class TextInputLayer extends Component {
    static propTypes = {
        textObjects: PropTypes.array,
        canvasWidth: PropTypes.number,
        canvasHeight: PropTypes.number,
        onShapeDragStart: PropTypes.func,
        onShapeDrag: PropTypes.func,
        onShapeDragStop: PropTypes.func,
        onShapeClick: PropTypes.func,
        onTextInputChange: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.handleShapeDragStart = this.handleShapeDragStart.bind(this);
        this.handleShapeDrag = this.handleShapeDrag.bind(this);
        this.handleShapeDragStop = this.handleShapeDragStop.bind(this);
        this.handleShapeClick = this.handleShapeClick.bind(this);
        this.handleTextInputChange = this.handleTextInputChange.bind(this);
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

    handleTextInputChange(id, value, focused) {
        const { onTextInputChange } = this.props;
        onTextInputChange && onTextInputChange(id, value, focused);
    }

    render() {
        const { textObjects, canvasWidth, canvasHeight } = this.props;

        const textInputs = textObjects.map(text => {
            return (
                <TextInput
                    key={text.id}
                    {...text}
                    onClick={this.handleShapeClick}
                    onDragStart={this.handleShapeDragStart}
                    onDrag={this.handleShapeDrag}
                    onDragStop={this.handleShapeDragStop}
                    onChange={this.handleTextInputChange} />
            );
        });
        return (
            <div style={{ position: 'absolute', width: canvasWidth, height: canvasHeight, pointerEvents: 'none' }}>
                {textInputs}
            </div>
        );
    }
}

export default TextInputLayer;
