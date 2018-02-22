import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Path } from '.';

class TransparentLine extends Component {
    static propTypes = {
        id: PropTypes.string,
        index: PropTypes.number,
        onDragStart: PropTypes.func,
        onDrag: PropTypes.func,
        onDragStop: PropTypes.func,
        onClick: PropTypes.func,
        points: PropTypes.arrayOf(PropTypes.number),
        stroke: PropTypes.string,
        strokeWidth: PropTypes.number,
        strokeDasharray: PropTypes.string,
        arrowheadId: PropTypes.string,
        arrowheadLength: PropTypes.number,
        arrowheadShown: PropTypes.string,
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

        this.handleDragStop = this.handleDragStop.bind(this);
    }

    handleDragStop(id, draggableData) {
        const { onDragStop, index } = this.props;
        if (index > -1) {
            onDragStop && onDragStop(id, index, draggableData);
        }
    }

    render() {
        let { id, points, strokeWidth, index, propagateEvents } = this.props;

        const svgProps = {
            d: [{command: 'M', parameters: [points[0], points[1]]}, {command: 'L', parameters: [points[2], points[3]]}],
            opacity: 0
        };

        if (index > -1) {
            propagateEvents = false;
            svgProps.opacity = 1;
            svgProps.strokeWidth = strokeWidth;
            svgProps.stroke = 'transparent';
        }

        return (
            <Path
                id={id + "_transparent"}
                onDragStop={this.handleDragStop}
                {...svgProps}
                propagateEvents={propagateEvents}
            />
        );
    }
}

export default TransparentLine;
