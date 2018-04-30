import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Path } from '.';

class Line extends Component {
    static propTypes = {
        id: PropTypes.string,
        onDragStart: PropTypes.func,
        onDrag: PropTypes.func,
        onDragStop: PropTypes.func,
        onClick: PropTypes.func,
        points: PropTypes.arrayOf(PropTypes.number),
        stroke: PropTypes.string,
        strokeWidth: PropTypes.number,
        strokeLinecap: PropTypes.string,
        strokeDasharray: PropTypes.string,
        arrowHeadId: PropTypes.string,
        arrowTailId: PropTypes.string,
        arrowHeadLength: PropTypes.number,
        arrowTailLength: PropTypes.number,
        arrowHeadShown: PropTypes.bool,
        arrowTailShown: PropTypes.bool,
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
        const { id, arrowHeadId, arrowTailId, arrowHeadLength, arrowTailLength, arrowHeadShown, arrowTailShown, points, stroke, strokeWidth, strokeDasharray, strokeLinecap, propagateEvents } = this.props;

        let l = Math.sqrt((points[2] - points[0]) ** 2 + (points[3] - points[1]) ** 2);

        let arrowEndX = (1 - (l - arrowHeadLength) / l) * points[0] + (l - arrowHeadLength) / l * points[2];
        let arrowEndY = (1 - (l - arrowHeadLength) / l) * points[1] + (l - arrowHeadLength) / l * points[3];

        let arrowStartX = (1 - (l - arrowTailLength) / l) * points[2] + (l - arrowTailLength) / l * points[0];
        let arrowStartY = (1 - (l - arrowTailLength) / l) * points[3] + (l - arrowTailLength) / l * points[1];

        const svgProps = {
            d: [{command: 'M', parameters: [arrowStartX, arrowStartY]}, {command: 'L', parameters: [arrowEndX, arrowEndY]}],
            stroke,
            strokeWidth,
            strokeDasharray,
            arrowHeadId,
            arrowTailId,
            strokeLinecap,
            markerStart: "url(#" + arrowTailId + ")",
            markerEnd: "url(#" + arrowHeadId + ")"
        };

        let x1 = arrowStartX;
        let y1 = arrowStartY;
        let x2 = arrowEndX;
        let y2 = arrowEndY;
        // let x1 = points[0];
        // let y1 = points[1];
        // let x2 = points[2];
        // let y2 = points[3];

        if (!arrowHeadShown) {
            svgProps.markerEnd = "none";
            x2 = points[2];
            y2 = points[3];
            // svgProps.d = [{command: 'M', parameters: [points[0], points[1]]}, {command: 'L', parameters: [points[2], points[3]]}];
        }

        if (!arrowTailShown) {
            svgProps.markerStart = "none";
            x1 = points[0];
            y1 = points[1];
            // svgProps.d = [{command: 'M', parameters: [points[0], points[1]]}, {command: 'L', parameters: [points[2], points[3]]}];
        }

        if (l < arrowHeadLength || isNaN(arrowEndX) || isNaN(arrowEndY)) {
            // x2 = arrowEndX;
            // y2 = arrowEndY;
            // x2 = (1 - (l - 0.01) / l) * points[2] + (l - 0.01) / l * points[0];
            // y2 = (1 - (l - 0.01) / l) * points[3] + (l - 0.01) / l * points[1];
        }

        if (l < arrowTailLength || isNaN(arrowStartX) || isNaN(arrowStartY)) {
            // x1 = arrowStartX;
            // y1 = arrowStartY;
            // x1 = (1 - (l - 0.01) / l) * points[2] + (l - 0.01) / l * points[0];
            // y1 = (1 - (l - 0.01) / l) * points[3] + (l - 0.01) / l * points[1];
            // svgProps.d = [{command: 'M', parameters: [points[0], points[1]]}, {command: 'L', parameters: [lineEndX, lineEndY]}];
        }

        svgProps.d = [{command: 'M', parameters: [x1, y1]}, {command: 'L', parameters: [x2, y2]}];

        // if (isNaN(svgProps.d[1].parameters[0])) svgProps.d[1].parameters[0] = points[0];
        // if (isNaN(svgProps.d[1].parameters[1])) svgProps.d[1].parameters[1] = points[1];

        // console.log("coordinates:", points[0], points[1], ",", points[2], points[3]);
        // console.log("arrowShown?", arrowHeadShown, arrowTailShown);
        // console.log("arrow lengths:", arrowHeadLength, arrowTailLength);
        // console.log("new coordinates", x1, y1, x2, y2);
        // console.log("---------------------");

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
