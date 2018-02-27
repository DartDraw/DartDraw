import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Shape } from '.';
import { formatPath, formatTransform } from '../../../utilities/shapes';

class Path extends Component {
    static propTypes = {
        id: PropTypes.string,
        arrowheadId: PropTypes.string,
        onDragStart: PropTypes.func,
        onDrag: PropTypes.func,
        onDragStop: PropTypes.func,
        onClick: PropTypes.func,
        d: PropTypes.arrayOf(PropTypes.shape({
            command: PropTypes.string,
            parameters: PropTypes.arrayOf(PropTypes.number)
        })),
        stroke: PropTypes.string,
        strokeWidth: PropTypes.number,
        strokeDasharray: PropTypes.string,
        strokeLinecap: PropTypes.string,
        fill: PropTypes.string,
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
        const { id, arrowheadId, d, stroke, strokeWidth, strokeDasharray, strokeLinecap, fill, transform, propagateEvents } = this.props;
        const svgProps = {
            id,
            d: formatPath(d),
            stroke,
            strokeWidth,
            strokeDasharray,
            strokeLinecap,
            fill: fill || 'none',
            transform: formatTransform(transform),
            vectorEffect: "non-scaling-stroke",
            markerEnd: "url(#" + arrowheadId + ")"
        };

        if (arrowheadId) {
            svgProps.markerEnd = "url(#" + arrowheadId + ")";
        }

        return (
            <Shape
                id={id}
                onDragStart={this.handleDragStart}
                onDrag={this.handleDrag}
                onDragStop={this.handleDragStop}
                onClick={this.handleClick}
                propagateEvents={propagateEvents}
            >
                <path {...svgProps} />
            </Shape>
        );
    }
}

export default Path;
