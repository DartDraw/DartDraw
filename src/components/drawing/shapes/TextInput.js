import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Editor, EditorState } from 'draft-js';
import './text-input.css';

class TextInput extends Component {
    static propTypes = {
        id: PropTypes.string,
        onDragStart: PropTypes.func,
        onDrag: PropTypes.func,
        onDragStop: PropTypes.func,
        onClick: PropTypes.func,
        x: PropTypes.number,
        y: PropTypes.number,
        width: PropTypes.number,
        height: PropTypes.number,
        fontFamily: PropTypes.string,
        fontSize: PropTypes.string,
        fontWeight: PropTypes.string,
        fontStyle: PropTypes.oneOf(['normal', 'italic', 'oblique']),
        textAlign: PropTypes.oneOf(['center', 'left', 'right']),
        textDecoration: PropTypes.oneOf(['none', 'underline', 'line-through']),
        lineHeight: PropTypes.string,
        fill: PropTypes.string,
        stroke: PropTypes.string,
        onChange: PropTypes.func,
        propagateEvents: PropTypes.bool
    };

    constructor(props) {
        super(props);

        this.state = {
            editorState: EditorState.createEmpty()
        };

        this.handleDragStart = this.handleDragStart.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
        this.handleDragStop = this.handleDragStop.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        setTimeout(() => {
            this.textInput.focus();
        }, 200);
    }

    handleDragStart(id, draggableData) {
        const { onDragStart } = this.props;
        onDragStart && onDragStart(id, draggableData);
    }

    handleDrag(id, draggableData) {
        const { onDrag } = this.props;
        onDrag && onDrag(id, draggableData);
    }

    handleDragStop(id, draggableData) {
        const { onDragStop } = this.props;
        onDragStop && onDragStop(id, draggableData);
    }

    handleClick(id, event) {
        const { onClick } = this.props;
        onClick && onClick(id, event);
    }

    handleChange(editorState) {
        const { id, onChange } = this.props;
        this.setState({ editorState });
        onChange && onChange(id, editorState.getCurrentContent().getPlainText(), editorState.getSelection().getHasFocus());
    }

    render() {
        const { id, x, y, width, height, fontFamily, fontSize, fontWeight, fontStyle, textAlign, textDecoration, lineHeight, fill, propagateEvents } = this.props;
        const { editorState } = this.state;

        return (
            <div
                id={id}
                style={{
                    pointerEvents: 'all',
                    position: 'absolute',
                    left: width < 0 ? x + width : x,
                    top: height < 0 ? y + height : y,
                    width: Math.abs(width),
                    height: Math.abs(height),
                    color: fill,
                    fontFamily,
                    fontSize: fontSize + 'px',
                    fontWeight,
                    fontStyle,
                    textAlign,
                    textDecoration,
                    lineHeight: parseInt(fontSize) > parseInt(lineHeight) ? fontSize + 'px' : lineHeight + 'px'
                }}
                onClick={event => { this.handleClick(id, event); }}
            >
                <Editor
                    editorState={editorState}
                    onChange={this.handleChange}
                    style={{
                        position: 'absolute',
                        left: width < 0 ? x + width : x,
                        top: height < 0 ? y + height : y,
                        width: Math.abs(width),
                        height: Math.abs(height)
                    }}
                    ref={(input) => { this.textInput = input; }} />
            </div>
        );
    }
}

export default TextInput;
