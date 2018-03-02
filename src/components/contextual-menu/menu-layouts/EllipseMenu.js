import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Select } from '../../ui';
import './menu-layouts.css';

class EllipseMenu extends Component {
    static propTypes = {
        ellipse: PropTypes.object,
        onEdit: PropTypes.func,
        onRotateShapeTo: PropTypes.func,
        onMoveShapeTo: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.handleStrokeWidth = this.handleStrokeWidth.bind(this);
        this.handleRotationChange = this.handleRotationChange.bind(this);
        this.handleXChange = this.handleXChange.bind(this);
        this.handleYChange = this.handleYChange.bind(this);
        this.handleWidthChange = this.handleWidthChange.bind(this);
        this.handleHeightChange = this.handleHeightChange.bind(this);
    }

    handleStrokeWidth(value) {
        const { ellipse, onEdit } = this.props;
        const newEllipse = Object.assign({}, ellipse, { strokeWidth: value });
        onEdit && onEdit(newEllipse);
    }

    handleRotationChange(value) {
        const {onRotateShapeTo} = this.props;
        onRotateShapeTo && onRotateShapeTo(value);
    }

    handleXChange(value) {
        const { ellipse, onMoveShapeTo } = this.props;
        onMoveShapeTo && onMoveShapeTo(value, ellipse.info.cy);
    }

    handleYChange(value) {
        const { ellipse, onMoveShapeTo } = this.props;
        onMoveShapeTo && onMoveShapeTo(ellipse.info.cx, value);
    }

    handleWidthChange(value) {
        console.log(value);
    }

    handleHeightChange(value) {
        console.log(value);
    }

    render() {
        return (
            <div className="ellipse-menu menu">
                <div className="menu-title">Ellipse</div>
                <div className="menu-row">
                    <div className="menu-row-title">Stroke:</div>
                    <Select value={this.props.ellipse.strokeWidth} style={{ width: 90 }} onChange={this.handleStrokeWidth}>
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                        <option value="20">20</option>
                    </Select>
                </div>
                <div className="menu-row">
                    <div className="menu-row-title">Position:</div>
                    <Input value={this.props.ellipse.info.cx} label="Center Coordinate X" style={{ width: 49, marginRight: 11 }} onChange={this.handleXChange} />
                    <Input value={this.props.ellipse.info.cy} label="Center Coordinate Y" style={{ width: 49 }} onChange={this.handleYChange} />
                </div>
                <div className="menu-row">
                    <div className="menu-row-title">Size:</div>
                    <Input value={this.props.ellipse.info.rx} label="X Radius" style={{ width: 49, marginRight: 11 }} onChange={this.handleWidthChange} />
                    <Input value={this.props.ellipse.info.ry} label="Y Radius" style={{ width: 49 }} onChange={this.handleHeightChange} />
                </div>
                <div className="menu-row">
                    <div className="menu-row-title">Rotation:</div>
                    <Input value={this.props.ellipse.info.rotation} label="Rotation" onChange={this.handleRotationChange} />
                </div>
            </div>
        );
    }
}

export default EllipseMenu;
