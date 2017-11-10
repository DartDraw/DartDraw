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
        onHandleTextInputChange: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.handleTextInputChange = this.handleTextInputChange.bind(this);
    }

    handleTextInputChange(event) {
        const { onHandleTextInputChange } = this.props;

        onHandleTextInputChange(event.target.id, event.target.value);
    }

    renderInputs() {
        const { textInputs } = this.props;

        return Object.keys(textInputs).map(textInputId => {
            const textInput = textInputs[textInputId];

            return (
                <input
                    key={textInput.id}
                    id={textInput.shapeId}
                    type="text"
                    value={textInput.value}
                    onChange={this.handleTextInputChange}
                    style={{position: 'absolute', top: textInput.y, left: textInput.x, pointerEvents: 'all'}}
                />
            );
        });
    }

    render() {
        return <div style={{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, pointerEvents: 'none'}}>{this.renderInputs()}</div>;
    }
}

export default TextInputLayer;
