import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select, Input } from '../../ui';
import './menu-layouts.css';

class PolygonMenu extends Component {
    static propTypes = {
        polygon: PropTypes.object,
        onEdit: PropTypes.func,
        onEditPoint: PropTypes.func,
        onRotateShapeTo: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.handlePointChange = this.handlePointChange.bind(this);
        this.handleStrokeWidthChange = this.handleStrokeWidthChange.bind(this);
        this.handleRotationChange = this.handleRotationChange.bind(this);
    }

    handlePointChange(pointIndex, newX, newY) {
        const { polygon, onEditPoint } = this.props;
        onEditPoint && onEditPoint(polygon.id, pointIndex, newX, newY);
    }

    handleStrokeWidthChange(value) {
        const { polygon, onEdit } = this.props;
        const newPolygon = Object.assign({}, polygon, { strokeWidth: value });
        onEdit && onEdit(newPolygon);
    }

    handleRotationChange(value) {
        const {onRotateShapeTo} = this.props;
        onRotateShapeTo && onRotateShapeTo(value);
    }

    render() {
        const { polygon } = this.props;
        const pointInputs = polygon.info.points.map((point, i) => {
            return (
                <div key={i} className="menu-row">
                    <div className="menu-row-title">Point {i}</div>
                    <Input value={point.x} label="X" style={{ width: 49, marginRight: 11 }} onChange={this.handlePointChange} />
                    <Input value={point.y} label="Y" style={{ width: 49 }} onChange={this.handlePointChangeß} />
                </div>
            );
        });
        return (
            <div className="polygon-menu menu">
                <div className="menu-title">Polygon</div>
                <div className="menu-row">
                    <div className="menu-row-title">Rotation:</div>
                    <Input value={polygon.info.rotation} label="Rotation" onChange={this.handleRotationChange} />
                </div>
                <div className="menu-row">
                    <div className="menu-row-title">Stroke:</div>
                    <Select value={polygon.strokeWidth} style={{ width: 90 }} onChange={this.handleStrokeWidthChange}>
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                        <option value="20">20</option>
                    </Select>
                </div>
                <div className="points-list">
                    { pointInputs }
                </div>
            </div>
        );
    }
}

export default PolygonMenu;
