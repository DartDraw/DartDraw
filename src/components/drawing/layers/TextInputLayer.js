import React, { Component } from 'react';
import PropTypes from 'prop-types';

class TextInputLayer extends Component {
    static propTypes = {
        textInputs: PropTypes.shape({
            id: PropTypes.shape({
                id: PropTypes.string,
                shapeId: PropTypes.string,
                value: PropTypes.number,
                x: PropTypes.number,
                y: PropTypes.number
            })
        }),
        onHandleTextInputChange: PropTypes.func,
        onFocus: PropTypes.func,
        onBlur: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.handleTextInputChange = this.handleTextInputChange.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
    }

    handleTextInputChange(event) {
        const { onHandleTextInputChange } = this.props;
        onHandleTextInputChange(event.target.id, event.target.value);
    }

    handleFocus() {
        const { onFocus } = this.props;
        onFocus();
    }

    handleBlur() {
        const { onBlur } = this.props;
        onBlur();
    }

    renderInputs() {
        const { textInputs } = this.props;

        return Object.keys(textInputs).map(textInputId => {
            const textInput = textInputs[textInputId];

            return textInput.visible ? (
                <input
                    key={textInput.id}
                    id={textInput.shapeId}
                    type="text"
                    value={textInput.value}
                    onChange={this.handleTextInputChange}
                    onFocus={this.handleFocus}
                    onBlur={this.handleBlur}
                    style={{position: 'absolute', top: textInput.y, left: textInput.x, pointerEvents: 'all'}}
                />
            ) : null;
        });
    }

    render() {
        return <div style={{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, pointerEvents: 'none'}}>{this.renderInputs()}</div>;
    }
}

export default TextInputLayer;
