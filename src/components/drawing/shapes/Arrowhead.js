import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Path } from '.';

import { formatPath } from '../../../utilities/shapes';

class Arrowhead extends Component {
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
        console.log(this.props);
        const { onDragStart } = this.props;
        onDragStart && onDragStart(this.props.id, draggableData);
    }

    handleDrag(id, draggableData) {
        console.log(this.props);
        const { onDrag } = this.props;
        onDrag && onDrag(this.props.id, draggableData);
    }

    handleDragStop(id, draggableData) {
        console.log(this.props);
        const { onDragStop } = this.props;
        onDragStop && onDragStop(this.props.id, draggableData);
    }

    handleClick(id, event) {
        console.log(this.props);
        const { onClick } = this.props;
        onClick && onClick(this.props.id, event);
    }

    render() {
        const { id, arrowId, points, stroke, strokeDasharray, propagateEvents } = this.props;

        const svgProps = {
            fill: stroke || 'none',
            vectorEffect: "non-scaling-stroke"
        };

        return (
            <marker id={arrowId} key={arrowId + "_marker"} orient="auto" markerWidth="50" markerHeight="50"
                viewBox="-6 -6 12 12" refX="-2" refY="0" markerUnits="userSpaceOnUse" preserveAspectRatio="xMinYMin">
                onDragStart={() => console.log("hi")}
                onDrag={this.handleDrag}
                onDragStop={this.handleDragStop}
                onClick={() => console.log("hi")}>
                <polygon points="-2,0 -5,5 5,0 -5,-5" fill={stroke} strokeDasharray={strokeDasharray} vector-effect="non-scaling-stroke" />
            </marker>
        );
    }
}

export default Arrowhead;
