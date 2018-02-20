import React, { Component } from 'react';
import PropTypes from 'prop-types';
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

class Text extends Component {
    static propTypes = {
        id: PropTypes.string,
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
        tspans: PropTypes.arrayOf(PropTypes.shape({
            range: PropTypes.arrayOf(PropTypes.number),
            style: PropTypes.object
        })),
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

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(id, event) {
        const { onClick } = this.props;
        onClick && onClick(id, event);
    }

    render() {
        const {
            id,
            x,
            y,
            width,
            height,
            transform,
            text,
            tspans,
            propagateEvents
        } = this.props;
        const normalizedX = width < 0 ? x + width : x;
        const normalizedY = height < 0 ? y + height : y;
        const normalizedWidth = Math.abs(width);
        const normalizedHeight = Math.abs(height);

        // Apply tspans:
        const baseStyle = getTextStyle(this.props);
        let sortedTspans = tspans.slice();
        sortedTspans.sort((a, b) => {
            return a.range[0] - b.range[0];
        });
        const element = sortedTspans.length > 0 ? sortedTspans.map(tspan => {
            return (
                <span
                    key={tspan.range[0]}
                    style={{
                        ...Object.assign({}, baseStyle, getTextStyle(tspan.style)),
                        display: 'inline',
                        overflowWrap: 'break-word',
                        whiteSpace: 'pre-wrap',
                        WebkitLineBreak: 'after-white-space'
                    }}
                >
                    {text.slice(tspan.range[0], tspan.range[1])}
                </span>
            );
        }) : (
            <span style={{ overflowWrap: 'break-word', whiteSpace: 'pre-wrap', ...baseStyle }}>{text}</span>
        );

        return (
            <Shape id={id} onClick={this.handleClick} propagateEvents={propagateEvents}>
                <foreignObject
                    id={id}
                    x={normalizedX}
                    y={normalizedY}
                    width={normalizedWidth}
                    height={normalizedHeight}
                    onClick={this.handleClick}
                >
                    <div style={{
                        display: 'block',
                        width: normalizedWidth,
                        height: normalizedHeight,
                        whiteSpace: 'pre-wrap',
                        wordWrap: 'break-word',
                        textAlign: baseStyle.textAlign,
                        overflowWrap: 'break-word'
                    }}>
                        {element}
                    </div>
                </foreignObject>
            </Shape>
        );
    }
}

export default Text;
