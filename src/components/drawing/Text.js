import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Shape } from '.';
import { formatTransform } from '../../utilities/shapes';

class Text extends Component {
    static propTypes = {
        id: PropTypes.string,
        onDragStart: PropTypes.func,
        onDrag: PropTypes.func,
        onDragStop: PropTypes.func,
        onClick: PropTypes.func,
        text: PropTypes.string,
        x: PropTypes.number,
        y: PropTypes.number,
        tspans: PropTypes.arrayOf(PropTypes.shape({
            indices: PropTypes.arrayOf(PropTypes.shape({
                first: PropTypes.number,
                last: PropTypes.number
            })),
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
        const { id, x, y, tspans, transform, propagateEvents, text } = this.props;
        const svgProps = {
            id,
            x,
            y,
            transform: formatTransform(transform)
        };

        const element = tspans ? tspans.map(tspan => {
            return (
                <tspan style={tspan.style}>
                    {text.slice(tspan.indices.first, tspan.indices.last)}
                </tspan>
            );
        }) : text;

        return (
            <Shape
                id={id}
                onDragStart={this.handleDragStart}
                onDrag={this.handleDrag}
                onDragStop={this.handleDragStop}
                onClick={this.handleClick}
                propagateEvents={propagateEvents}
            >
                <text {...svgProps}>
                    {element}
                </text>
            </Shape>
        );
    }
}

export default Text;
