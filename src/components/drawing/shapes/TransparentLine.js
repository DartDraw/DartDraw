import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Path } from '.';

class TransparentLine extends Component {
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

    render() {
        const { id, points, propagateEvents } = this.props;

        const svgProps = {
            d: [{command: 'M', parameters: [points[0], points[1]]}, {command: 'L', parameters: [points[2], points[3]]}],
            opacity: 0
        };

        return (
            <Path
                id={id + "_transparent"}
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

export default TransparentLine;
