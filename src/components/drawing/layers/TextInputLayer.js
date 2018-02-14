import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextInput } from '../shapes';

class TextInputLayer extends Component {
    static propTypes = {
        textObjects: PropTypes.array,
        canvasWidth: PropTypes.number,
        canvasHeight: PropTypes.number,
        onShapeClick: PropTypes.func,
        onTextInputChange: PropTypes.func,
        propagateEvents: PropTypes.bool
    };

    constructor(props) {
        super(props);

        this.handleShapeClick = this.handleShapeClick.bind(this);
        this.handleTextInputChange = this.handleTextInputChange.bind(this);
    }

    handleShapeClick(shapeId, event) {
        this.props.onShapeClick(shapeId, event);
    }

    handleTextInputChange(id, value, focused, selectionRange) {
        const { onTextInputChange } = this.props;
        onTextInputChange && onTextInputChange(id, value, focused, selectionRange);
    }

    render() {
        const { textObjects, canvasWidth, canvasHeight, propagateEvents } = this.props;

        const textInputs = textObjects.map(text => {
            return (
                <TextInput
                    key={text.id}
                    {...text}
                    onClick={this.handleShapeClick}
                    onChange={this.handleTextInputChange}
                    propagateEvents={propagateEvents}
                />
            );
        });

        return textInputs.length > 0 ? (
            <div style={{
                position: 'absolute',
                width: canvasWidth,
                height: canvasHeight,
                pointerEvents: 'none',
                overflow: 'hidden'
            }}>
                {textInputs}
            </div>
        ) : null;
    }
}

export default TextInputLayer;
