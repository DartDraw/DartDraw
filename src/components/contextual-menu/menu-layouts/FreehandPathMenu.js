import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select, Input } from '../../ui';
import './menu-layouts.css';

class FreehandPathMenu extends Component {
    static propTypes = {
        freehandPath: PropTypes.object,
        onEdit: PropTypes.func,
        onRotateShapeTo: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.handleStrokeWidthChange = this.handleStrokeWidthChange.bind(this);
        this.handleRotationChange = this.handleRotationChange.bind(this);
    }

    handleStrokeWidthChange(value) {
        const { freehandPath, onEdit } = this.props;
        const newPath = Object.assign({}, freehandPath, { strokeWidth: value });
        onEdit && onEdit(newPath);
    }

    handleRotationChange(value) {
        const {onRotateShapeTo} = this.props;
        onRotateShapeTo && onRotateShapeTo(value);
    }

    render() {
        const { freehandPath } = this.props;

        return (
            <div className="freehandPath-menu menu">
                <div className="menu-title">Freehand Path</div>
                <div className="menu-row">
                    <div className="menu-row-title">Stroke:</div>
                    <Select value={freehandPath.strokeWidth} style={{ width: 90 }} onChange={this.handleStrokeWidthChange}>
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                        <option value="20">20</option>
                    </Select>
                </div>
                <div className="menu-row">
                    <div className="menu-row-title">Rotation:</div>
                    <Input value={freehandPath.info.rotation} label="Rotation" onChange={this.handleRotationChange} />
                </div>
            </div>
        );
    }
}

export default FreehandPathMenu;
