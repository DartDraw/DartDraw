import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Select } from '../../ui';
import './menu-layouts.css';

class PathMenu extends Component {
    static propTypes = {
        path: PropTypes.object,
        onEdit: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.handleStrokeDasharrayChange = this.handleStrokeDasharrayChange.bind(this);
        this.handleStrokeWidth = this.handleStrokeWidth.bind(this);
        this.handleArrowShown = this.handleArrowShown.bind(this);
        this.handleArrowType = this.handleArrowType.bind(this);
    }

    handleX1Change(value) {
        const { path, onEdit } = this.props;
        const newPath = Object.assign({}, path);
        // newPath.points[0] = value;
        onEdit && onEdit(newPath);
    }

    handleY1Change(value) {
        const { path, onEdit } = this.props;
        const newPath = Object.assign({}, path);
        // newPath.points[1] = value;
        onEdit && onEdit(newPath);
    }

    handleX2Change(value) {
        const { path, onEdit } = this.props;
        const newPath = Object.assign({}, path);
        // newPath.points[2] = value;
        onEdit && onEdit(newPath);
    }

    handleY2Change(value) {
        const { path, onEdit } = this.props;
        const newPath = Object.assign({}, path);
        // newPath.points[3] = value;
        onEdit && onEdit(newPath);
    }

    handleStrokeDasharrayChange(value) {
        const { path, onEdit } = this.props;
        const newPath = Object.assign({}, path, { strokeDasharray: value });
        onEdit && onEdit(newPath);
    }

    handleStrokeWidth(value) {
        const { path, onEdit } = this.props;
        if (value > 0) {
            const newPath = Object.assign({}, path, { strokeWidth: value });
            onEdit && onEdit(newPath);
        }
    }

    handleArrowShown(value) {
        const { path, onEdit } = this.props;
        const newPath = Object.assign({}, path, { arrowShown: value });
        onEdit && onEdit(newPath);
    }

    handleArrowType(value) {
        const { path, onEdit } = this.props;
        const newPath = Object.assign({}, path, { arrowType: value });
        onEdit && onEdit(newPath);
    }

    render() {
        return (
            <div className="path-menu menu">
                <div className="menu-title">Line</div>
                <div className="menu-row">
                    <div className="menu-row-title">Point 1:</div>
                    <Input value={this.props.path.points[0]} label="X1" style={{ width: 49, marginRight: 11 }} onChange={this.handleX1Change} />
                    <Input value={this.props.path.points[1]} label="Y1" style={{ width: 49 }} onChange={this.handleY1Change} />
                </div>
                <div className="menu-row">
                    <div className="menu-row-title">Point 2:</div>
                    <Input value={this.props.path.points[2]} label="X2" style={{ width: 49, marginRight: 11 }} onChange={this.handleX2Change} />
                    <Input value={this.props.path.points[3]} label="Y2" style={{ width: 49 }} onChange={this.handleY2Change} />
                </div>
                <div className="menu-row">
                    <div className="menu-row-title">Stroke Pattern:</div>
                    <Select value={this.props.path.strokeDasharray} onChange={this.handleStrokeDasharrayChange}>
                        <option value='1, 0'>Option 1</option>
                        <option value='7, 2'>Option 2</option>
                        <option value='5, 5'>Option 3</option>
                        <option value='2, 7'>Option 4</option>
                    </Select>
                </div>
                <div className="menu-row">
                    <div className="menu-row-title">Stroke Width:</div>
                    <Select value={this.props.path.strokeWidth} onChange={this.handleStrokeWidth}>
                        <option value="1">1</option>
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                        <option value="20">20</option>
                    </Select>
                </div>
                <div className="menu-row">
                    <div className="menu-row-title">Arrow:</div>
                    <Select value={this.props.path.arrowShown} onChange={this.handleArrowShown}>
                        <option value="yes">yes</option>
                        <option value="no">no</option>
                    </Select>
                </div>
                <div className="menu-row">
                    <div className="menu-row-title">Arrow Type:</div>
                    <Select value={this.props.path.arrowType} onChange={this.handleArrowType}>
                        <option value="triangle">triangle</option>
                        <option value="barbed">barbed</option>
                        <option value="circle">circle</option>
                        <option value="square">square</option>
                        <option value="line">line</option>
                    </Select>
                </div>
            </div>
        );
    }
}

export default PathMenu;
