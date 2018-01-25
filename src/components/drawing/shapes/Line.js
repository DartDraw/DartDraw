import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Path } from '.';

class Line extends Component {
    static propTypes = {
        id: PropTypes.string,
        arrowId: PropTypes.string,
        onDragStart: PropTypes.func,
        onDrag: PropTypes.func,
        onDragStop: PropTypes.func,
        onClick: PropTypes.func,
        points: PropTypes.arrayOf(PropTypes.number),
        stroke: PropTypes.string,
        strokeWidth: PropTypes.number,
        strokeDasharray: PropTypes.string,
        arrowLength: PropTypes.number,
        arrowShown: PropTypes.string,
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
        const { id, arrowId, arrowLength, arrowShown, points, stroke, strokeWidth, strokeDasharray, propagateEvents } = this.props;

        let l = Math.sqrt((points[2] - points[0]) ** 2 + (points[3] - points[1]) ** 2);

        let arrowEndX = (1 - (l - arrowLength) / l) * points[0] + (l - arrowLength) / l * points[2];
        let arrowEndY = (1 - (l - arrowLength) / l) * points[1] + (l - arrowLength) / l * points[3];

        const svgProps = {
            d: [{command: 'M', parameters: [points[0], points[1]]}, {command: 'L', parameters: [arrowEndX, arrowEndY]}],
            stroke,
            strokeWidth,
            strokeDasharray,
            arrowId
        };

        if (arrowShown === 'no' || l < arrowLength || isNaN(arrowEndX) || isNaN(arrowEndY)) {
            svgProps.arrowId = null;
            svgProps.d = [{command: 'M', parameters: [points[0], points[1]]}, {command: 'L', parameters: [points[2], points[3]]}];
        }
        return (
            <Path
                id={id}
                onDragStart={this.handleDragStart}
                onDrag={this.handleDrag}
                onDragStop={this.handleDragStop}
                onClick={this.handleClick}
                {...svgProps}
                propagateEvents={propagateEvents}
            />
        );
    }
}

export default Line;
