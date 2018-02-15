import React, { Component } from 'react';
import uuidv1 from 'uuid';
import PropTypes from 'prop-types';
import { Draggable } from '../../shared';
import { Polygon } from '../../drawing/shapes';
import './gui-editors.css';

class Arrowhead_GUI extends Component {
    static propTypes = {
        onDragStart: PropTypes.func,
        onDrag: PropTypes.func,
        onDragStop: PropTypes.func,
        path: PropTypes.object,
        arrowheadType: PropTypes.string
    };

    constructor(props) {
        super(props);

        this.handleDragStart = this.handleDragStart.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
        this.handleDragStop = this.handleDragStop.bind(this);
        this.renderArrowhead = this.renderArrowhead.bind(this);
    }

    handleDragStart(draggableData) {
        this.props.onDragStart(draggableData);
    }

    handleDrag(draggableData) {
        console.log("dragging");
        this.props.onDrag(draggableData);
    }

    handleDragStop(draggableData) {
        this.props.onDragStop(draggableData);
    }

    renderArrowhead(arrowheadType) {
        const { stroke, strokeWidth } = this.props.path;
        const arrowhead = {
            id: uuidv1(),
            type: 'polyline',
            points: [175, 75, 150, 25, 250, 75, 150, 125],
            fill: stroke,
            stroke: stroke,
            transform: [{command: 'matrix', parameters: [1, 0, 0, 1, 0, 0]}],
            strokeWidth: strokeWidth
        };

        switch (arrowheadType) {
            case 'triangle':
                return <Polygon {...arrowhead} />;
            default:
                break;
        }
    }

    render() {
        const { path, arrowheadType } = this.props;
        return (
            <div style={{flex: 1}}>
                <Draggable
                    onStart={this.handleDragStart}
                    onDrag={this.handleDrag}
                    onStop={this.handleDragStop}
                >
                    <svg className="arrowhead-gui">
                        <line x1={50} y1={75} x2={250} y2={75} strokeWidth={path.strokeWidth} stroke={path.stroke} />
                        {this.renderArrowhead(arrowheadType)}
                    </svg>
                </Draggable>
            </div>
        );
    }
}

export default Arrowhead_GUI;
