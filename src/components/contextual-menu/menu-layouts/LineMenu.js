import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Select } from '../../ui';
import './menu-layouts.css';

class LineMenu extends Component {
    static propTypes = {
        line: PropTypes.object,
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
        const { line, onEdit } = this.props;
        const newLine = Object.assign({}, line);
        // newLine.points[0] = value;
        onEdit && onEdit(newLine);
    }

    handleY1Change(value) {
        const { line, onEdit } = this.props;
        const newLine = Object.assign({}, line);
        // newLine.points[1] = value;
        onEdit && onEdit(newLine);
    }

    handleX2Change(value) {
        const { line, onEdit } = this.props;
        const newLine = Object.assign({}, line);
        // newLine.points[2] = value;
        onEdit && onEdit(newLine);
    }

    handleY2Change(value) {
        const { line, onEdit } = this.props;
        const newLine = Object.assign({}, line);
        // newLine.points[3] = value;
        onEdit && onEdit(newLine);
    }

    handleStrokeDasharrayChange(value) {
        const { line, onEdit } = this.props;
        const newLine = Object.assign({}, line, { strokeDasharray: value });
        onEdit && onEdit(newLine);
    }

    handleStrokeWidth(value) {
        const { line, onEdit } = this.props;
        if (value > 0) {
            const newLine = Object.assign({}, line, { strokeWidth: value });
            onEdit && onEdit(newLine);
        }
    }

    handleArrowShown(value) {
        const { line, onEdit } = this.props;
        const newLine = Object.assign({}, line, { arrowShown: value });
        onEdit && onEdit(newLine);
    }

    handleArrowType(value) {
        const { line, onEdit } = this.props;
        const newLine = Object.assign({}, line, { arrowType: value });
        onEdit && onEdit(newLine);
    }

    render() {
        return (
            <div className="line-menu menu">
                <div className="menu-title">Line</div>
                <div className="menu-row">
                    <div className="menu-row-title">Point 1:</div>
                    <Input value={this.props.line.points[0]} label="X1" style={{ width: 49, marginRight: 11 }} onChange={this.handleX1Change} />
                    <Input value={this.props.line.points[1]} label="Y1" style={{ width: 49 }} onChange={this.handleY1Change} />
                </div>
                <div className="menu-row">
                    <div className="menu-row-title">Point 2:</div>
                    <Input value={this.props.line.points[2]} label="X2" style={{ width: 49, marginRight: 11 }} onChange={this.handleX2Change} />
                    <Input value={this.props.line.points[3]} label="Y2" style={{ width: 49 }} onChange={this.handleY2Change} />
                </div>
                <div className="menu-row">
                    <div className="menu-row-title">Stroke Pattern:</div>
                    <Select value={this.props.line.strokeDasharray} onChange={this.handleStrokeDasharrayChange}>
                        <option value='1, 0'>Option 1</option>
                        <option value='7, 2'>Option 2</option>
                        <option value='5, 5'>Option 3</option>
                        <option value='2, 7'>Option 4</option>
                    </Select>
                </div>
                <div className="menu-row">
                    <div className="menu-row-title">Stroke Width:</div>
                    <Select value={this.props.line.strokeWidth} onChange={this.handleStrokeWidth}>
                        <option value="1">1</option>
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                        <option value="20">20</option>
                    </Select>
                </div>
                <div className="menu-row">
                    <div className="menu-row-title">Arrow:</div>
                    <Select value={this.props.line.arrowShown} onChange={this.handleArrowShown}>
                        <option value="yes">yes</option>
                        <option value="no">no</option>
                    </Select>
                </div>
                <div className="menu-row">
                    <div className="menu-row-title">Arrow Type:</div>
                    <Select value={this.props.line.arrowType} onChange={this.handleArrowType}>
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

export default LineMenu;
