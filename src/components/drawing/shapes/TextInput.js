import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Editor, EditorState, ContentState, SelectionState, RichUtils } from 'draft-js';
import { Shape } from '.';
import { formatTransform } from '../../../utilities/shapes';

function getTextStyle(text) {
    return {
        fontFamily: text.fontFamily,
        fontSize: text.fontSize + 'px',
        fontWeight: text.fontWeight,
        fontStyle: text.fontStyle,
        textAlign: text.textAlign,
        textDecoration: text.textDecoration,
        lineHeight: parseInt(text.fontSize) > parseInt(text.lineHeight) ? text.fontSize + 'px' : text.lineHeight + 'px',
        color: text.fill,
        stroke: text.stroke
    };
}

class TextInput extends Component {
    static propTypes = {
        id: PropTypes.string,
        text: PropTypes.string,
        tspans: PropTypes.arrayOf(PropTypes.shape({
            range: PropTypes.arrayOf(PropTypes.number),
            style: PropTypes.object
        })),
        selectionRange: PropTypes.array,
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
        transform: PropTypes.arrayOf(PropTypes.shape({
            command: PropTypes.string,
            parameters: PropTypes.arrayOf(PropTypes.number)
        })),
        onChange: PropTypes.func,
        propagateEvents: PropTypes.bool
    };

    constructor(props) {
        super(props);

        let editorState = EditorState.createWithContent(ContentState.createFromText(props.text));
        const originalSelectionState = editorState.getSelection();

        console.log(props.tspans);
        // Apply tspan styles:
        if (props.tspans.length > 0) {
            props.tspans.map((tspan, i) => {
                const currentKey = editorState.getSelection().getAnchorKey();
                const selectionState = SelectionState.createEmpty();
                const newSelectionState = selectionState.merge({
                    anchorKey: currentKey,
                    anchorOffset: tspan.range[0],
                    focusKey: currentKey,
                    focusOffset: tspan.range[1] > props.text.length ? tspan.range[1] - 1 : tspan.range[1]
                });
                editorState = EditorState.forceSelection(editorState, newSelectionState);
                editorState = RichUtils.toggleInlineStyle(editorState, i + 1);
            });
        }

        // Set focus to beginning:
        editorState = EditorState.forceSelection(editorState, originalSelectionState);

        this.state = {
            editorState,
            editing: true
        };

        this.handleDragStart = this.handleDragStart.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
        this.handleDragStop = this.handleDragStop.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({ editing: true }, () => {
                this.textInput.focus();
            });
        }, 200);
    }

    componentWillReceiveProps(nextProps) {
        const { tspans } = this.props;

        const newTspans = _.differenceWith(nextProps.tspans, tspans, (newTspan, tspan) => {
            if (newTspan.range[0] === tspan.range[0] && newTspan.range[1] === tspan.range[1]) {
                if (
                    newTspan.style.fontFamily === tspan.style.fontFamily &&
                    newTspan.style.fontSize === tspan.style.fontSize &&
                    newTspan.style.fontWeight === tspan.style.fontWeight &&
                    newTspan.style.fontStyle === tspan.style.fontStyle &&
                    newTspan.style.textDecoration === tspan.style.textDecoration &&
                    newTspan.style.fill === tspan.style.fill &&
                    newTspan.style.stroke === tspan.style.stroke
                ) {
                    return true;
                }
            }
            return false;
        });

        const deletedTspans = _.differenceWith(tspans, nextProps.tspans, (newTspan, tspan) => {
            if (newTspan.range[0] === tspan.range[0] && newTspan.range[1] === tspan.range[1]) {
                if (newTspan.style.fontSize === tspan.style.fontSize) {
                    return true;
                }
            }
            return false;
        });

        // If tspans have changed, reapply styles:
        if (newTspans.length > 0 || deletedTspans.length > 0) {
            let editorState = EditorState.createWithContent(ContentState.createFromText(nextProps.text));
            const currentKey = editorState.getSelection().getAnchorKey();
            if (nextProps.tspans.length > 0) {
                nextProps.tspans.map((tspan, i) => {
                    const selectionState = SelectionState.createEmpty();
                    const newSelectionState = selectionState.merge({
                        anchorKey: currentKey,
                        anchorOffset: tspan.range[0],
                        focusKey: currentKey,
                        focusOffset: tspan.range[1] > nextProps.text.length ? tspan.range[1] - 1 : tspan.range[1]
                    });
                    editorState = EditorState.forceSelection(editorState, newSelectionState);
                    editorState = RichUtils.toggleInlineStyle(editorState, i + 1);
                });
            }

            // Restore selection:
            const selectionState = SelectionState.createEmpty();
            const originalSelectionState = selectionState.merge({
                anchorKey: currentKey,
                anchorOffset: nextProps.selectionRange[0],
                focusKey: currentKey,
                focusOffset: nextProps.selectionRange[1]
            });
            editorState = EditorState.forceSelection(editorState, originalSelectionState);

            this.setState({
                editorState
            });
        }
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
        this.setState({ editorState }, () => {
            const selectionState = editorState.getSelection();
            const selectionRange = [selectionState.getStartOffset(), selectionState.getEndOffset()];
            onChange && onChange(id, editorState.getCurrentContent().getPlainText(), editorState.getSelection().getHasFocus(), selectionRange);
        });
    }

    render() {
        const {
            id,
            text,
            // still need to do selectionrange
            selectionRange,
            tspans,
            x,
            y,
            width,
            height,
            fill,
            fontFamily,
            fontSize,
            fontWeight,
            fontStyle,
            textAlign,
            textDecoration,
            lineHeight,
            transform,
            propagateEvents
        } = this.props;
        const { editorState, editing } = this.state;

        // Array of all style objects:
        const styleMap = { 0: getTextStyle(this.props) };
        tspans.map(({ style }, i) => {
            styleMap[i + 1] = getTextStyle(style);
        });

        const editorElement = (
            <Editor
                editorState={editorState}
                onChange={this.handleChange}
                onFocus={event => { this.handleClick(id, event); }}
                onBlur={event => {
                    this.setState({ editing: false });
                }}
                customStyleMap={styleMap}
                style={{
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
                ref={(input) => { this.textInput = input; }}
            />
        );

        const spans = tspans.length === 0 ? text : tspans.map(tspan => {
            const {
                fill,
                fontFamily,
                fontSize,
                fontWeight,
                fontStyle,
                textAlign,
                textDecoration,
                lineHeight
            } = tspan.style;

            return (
                <span
                    key={tspan.range[0]}
                    style={{
                        color: fill,
                        fontFamily,
                        fontSize: fontSize + 'px',
                        fontWeight,
                        fontStyle,
                        textAlign,
                        textDecoration,
                        lineHeight: parseInt(fontSize) > parseInt(lineHeight) ? fontSize + 'px' : lineHeight + 'px'
                    }}
                >
                    {text.substring(tspan.range[0], tspan.range[1])}
                </span>
            );
        });

        const textElement = (
            <div
                style={{
                    display: 'block',
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word',
                    userSelect: 'none'
                }}
                onDoubleClick={(event) => {
                    event.preventDefault();
                    this.setState({ editing: true }, () => { this.textInput.focus(); });
                }}
            >
                {spans}
            </div>
        );

        return (
            <Shape
                id={id}
                onDragStart={this.handleDragStart}
                onDrag={this.handleDrag}
                onDragStop={this.handleDragStop}
                onClick={this.handleClick}
                propagateEvents={propagateEvents}
            >
                <foreignObject
                    id={id}
                    x={width < 0 ? x + width : x}
                    y={height < 0 ? y + height : y}
                    width={Math.abs(width)}
                    height={Math.abs(height)}
                    transform={formatTransform(transform)}
                    style={{
                        pointerEvents: propagateEvents ? 'none' : 'all',
                        position: 'absolute'
                    }}
                >
                    <div
                        style={{
                            color: fill,
                            fontFamily,
                            fontSize: fontSize + 'px',
                            fontWeight,
                            fontStyle,
                            textAlign,
                            textDecoration,
                            lineHeight: parseInt(fontSize) > parseInt(lineHeight) ? fontSize + 'px' : lineHeight + 'px'
                        }}
                    >
                        {editing ? editorElement : textElement}
                    </div>
                </foreignObject>
            </Shape>
        );
    }
}

export default TextInput;
