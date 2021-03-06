import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Shape } from '.';
import { formatPoints, formatTransform } from '../../../utilities/shapes';

class Polygon extends Component {
    static propTypes = {
        id: PropTypes.string,
        onDragStart: PropTypes.func,
        onDrag: PropTypes.func,
        onDragStop: PropTypes.func,
        onClick: PropTypes.func,
        width: PropTypes.number,
        height: PropTypes.number,
        points: PropTypes.arrayOf(PropTypes.number),
        stroke: PropTypes.string,
        strokeWidth: PropTypes.number,
        strokeMiterlimit: PropTypes.number,
        fill: PropTypes.string,
        fillOpacity: PropTypes.number,
        transform: PropTypes.arrayOf(PropTypes.shape({
            command: PropTypes.string,
            parameters: PropTypes.arrayOf(PropTypes.number)
        })),
        propagateEvents: PropTypes.bool,
        reshapeInProgress: PropTypes.bool
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
            points,
            stroke,
            strokeWidth,
            strokeMiterlimit,
            fill,
            fillOpacity,
            transform,
            propagateEvents,
            reshapeInProgress
        } = this.props;

        const svgProps = {
            id,
            stroke,
            strokeWidth,
            strokeMiterlimit,
            fill,
            fillOpacity,
            transform: formatTransform(transform),
            points: formatPoints(points),
            vectorEffect: "non-scaling-stroke"
        };

        if (reshapeInProgress) {
            svgProps.pointerEvents = "visibleStroke";
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
                <polygon {...svgProps} />
            </Shape>
        );
    }
}

export default Polygon;
