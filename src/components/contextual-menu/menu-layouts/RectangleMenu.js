import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Select } from '../../ui';
import './menu-layouts.css';

class RectangleMenu extends Component {
    static propTypes = {
        rectangle: PropTypes.object,
        onEdit: PropTypes.func,
        onResizeShapeTo: PropTypes.func,
        onMoveShapeTo: PropTypes.func,
        onRotateShapeTo: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.handleXChange = this.handleXChange.bind(this);
        this.handleYChange = this.handleYChange.bind(this);
        this.handleStrokeWidth = this.handleStrokeWidth.bind(this);
        this.handleWidthChange = this.handleWidthChange.bind(this);
        this.handleHeightChange = this.handleHeightChange.bind(this);
        this.handleRotationChange = this.handleRotationChange.bind(this);
    }

    handleXChange(value) {
        const { rectangle, onMoveShapeTo } = this.props;
        const x = value;
        onMoveShapeTo && onMoveShapeTo(x, rectangle.info.y);
    }

    handleYChange(value) {
        const { rectangle, onMoveShapeTo } = this.props;
        const y = value;
        onMoveShapeTo && onMoveShapeTo(rectangle.info.x, y);
    }

    handleStrokeWidth(value) {
        const { rectangle, onEdit } = this.props;
        const newRectangle = Object.assign({}, rectangle, { strokeWidth: value });
        onEdit && onEdit(newRectangle);
    }

    handleWidthChange(value) {
        const {onResizeShapeTo} = this.props;
        const width = value;
        onResizeShapeTo && onResizeShapeTo(width);
    }

    handleHeightChange(value) {
        const {rectangle, onResizeShapeTo} = this.props;
        const height = value;
        onResizeShapeTo && onResizeShapeTo(rectangle.info.width, height);
    }

    handleRotationChange(value) {
        const {onRotateShapeTo} = this.props;
        const degree = value;
        onRotateShapeTo && onRotateShapeTo(degree);
    }

    render() {
        return (
            <div className="rectangle-menu menu">
                <div className="menu-title">RECTANGLE</div>
                <div className="menu-row">
                    <div className="menu-row-title">Stroke:</div>
                    <Select value={this.props.rectangle.strokeWidth} style={{ width: 90 }} onChange={this.handleStrokeWidth}>
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
                    <Input value={this.props.rectangle.info.x} label="X" style={{ width: 49, marginRight: 11 }} onChange={this.handleXChange} />
                    <Input value={this.props.rectangle.info.y} label="Y" style={{ width: 49 }} onChange={this.handleYChange} />
                </div>
                <div className="menu-row">
                    <div className="menu-row-title">Size:</div>
                    <Input value={this.props.rectangle.info.width} label="Width" style={{ width: 49, marginRight: 11 }} onChange={this.handleWidthChange} />
                    <Input value={this.props.rectangle.info.height} label="Height" style={{ width: 49 }} onChange={this.handleHeightChange} />
                </div>
                <div className="menu-row">
                    <div className="menu-row-title">Rotation:</div>
                    <Input value={this.props.rectangle.degree} label="Rotation" onChange={this.handleRotationChange} />
                </div>
            </div>
        );
    }
}

export default RectangleMenu;
