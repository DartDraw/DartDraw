import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Shape } from '.';
import { formatTransform } from '../../../utilities/shapes';

class Text extends Component {
    static propTypes = {
        id: PropTypes.string,
        selected: PropTypes.bool,
        onDragStart: PropTypes.func,
        onDrag: PropTypes.func,
        onDragStop: PropTypes.func,
        onClick: PropTypes.func,
        onChange: PropTypes.func,
        text: PropTypes.string,
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
        propagateEvents: PropTypes.bool
    }

    defaultProps = {
        propagateEvents: false
    }

    constructor(props) {
        super(props);

        this.handleDragStart = this.handleDragStart.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
        this.handleDragStop = this.handleDragStop.bind(this);
        this.handleClick = this.handleClick.bind(this);
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

    render() {
        const {
            id,
            selected,
            x,
            y,
            width,
            height,
            transform,
            text,
            fontFamily,
            fontSize,
            fontWeight,
            fontStyle,
            textAlign,
            textDecoration,
            lineHeight,
            fill,
            stroke,
            propagateEvents
        } = this.props;
        const normalizedX = width < 0 ? x + width : x;
        const normalizedY = height < 0 ? y + height : y;
        const normalizedWidth = Math.abs(width);
        const normalizedHeight = Math.abs(height);
        const styleProps = {
            width: normalizedWidth,
            height: normalizedHeight,
            fontFamily,
            fontSize: fontSize + 'px',
            fontWeight,
            fontStyle,
            textAlign,
            textDecoration,
            lineHeight: parseInt(fontSize) > parseInt(lineHeight) ? fontSize + 'px' : lineHeight + 'px',
            color: fill,
            stroke
        };

        return (
            <g id={id}>
                <foreignObject x={normalizedX} y={normalizedY} width={normalizedWidth} height={normalizedHeight}>
                    <div style={styleProps}>
                        {text}
                    </div>
                </foreignObject>
                {selected &&
                    <Shape
                        id={id}
                        onDragStart={this.handleDragStart}
                        onDrag={this.handleDrag}
                        onDragStop={this.handleDragStop}
                        onClick={this.handleClick}
                        propagateEvents={propagateEvents}
                    >
                        <rect
                            width={14}
                            height={14}
                            x={normalizedX + Math.abs(width) / 2 - 7}
                            y={normalizedY - 15}
                        />
                    </Shape>
                }
            </g>

        );
    }
}

export default Text;
