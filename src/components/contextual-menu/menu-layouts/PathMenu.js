import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select } from '../../ui';
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

    render() {
        return (
            <div className="path-menu menu">
                <div className="menu-title">Path</div>
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
                        <option value={1}>1</option>
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={15}>15</option>
                        <option value={20}>20</option>
                    </Select>
                </div>
                <div className="menu-row">
                    <div className="menu-row-title">Arrow:</div>
                    <Select value={this.props.path.arrowShown} onChange={this.handleArrowShown}>
                        <option value="yes">yes</option>
                        <option value="no">no</option>
                    </Select>
                </div>
            </div>
        );
    }
}

export default PathMenu;
