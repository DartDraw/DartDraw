import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Shape } from '.';

import { formatPath } from '../../../utilities/shapes';

class Bezier extends Component {
    static propTypes = {
        id: PropTypes.string,
        onDragStart: PropTypes.func,
        onDrag: PropTypes.func,
        onDragStop: PropTypes.func,
        onClick: PropTypes.func,
        index: PropTypes.number,
        points: PropTypes.arrayOf(PropTypes.number),
        controlPoints: PropTypes.arrayOf(PropTypes.object),
        stroke: PropTypes.string,
        strokeWidth: PropTypes.number,
        fill: PropTypes.string,
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

        this.handleDragStop = this.handleDragStop.bind(this);
    }

    handleDragStop(id, draggableData) {
        const { onDragStop } = this.props;
        onDragStop && onDragStop(id, this.props.index, draggableData);
    }

    render() {
        const {
            id,
            points,
            controlPoints,
            stroke,
            strokeWidth,
            fill,
            reshapeInProgress
        } = this.props;

        const svgProps = {
            id,
            stroke,
            strokeWidth,
            fill,
            d: formatPath([
                {command: 'M', parameters: [points[0], points[1]]},
                {command: 'C',
                    parameters: [controlPoints[0].x, controlPoints[0].y,
                        controlPoints[1].x, controlPoints[1].y, points[2], points[3]]}
            ]),
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
            >
                <path {...svgProps} />
            </Shape>
        );
    }
}

export default Bezier;
