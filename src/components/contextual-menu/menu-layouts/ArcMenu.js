import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select, Input } from '../../ui';
import './menu-layouts.css';

class ArcMenu extends Component {
    static propTypes = {
        arc: PropTypes.object,
        onEdit: PropTypes.func,
        onRotateShapeTo: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.handleStrokeWidthChange = this.handleStrokeWidthChange.bind(this);
        this.handleRotationChange = this.handleRotationChange.bind(this);
    }

    handleStrokeWidthChange(value) {
        const { arc, onEdit } = this.props;
        const newArc = Object.assign({}, arc, { strokeWidth: value });
        onEdit && onEdit(newArc);
    }

    handleRotationChange(value) {
        const {onRotateShapeTo} = this.props;
        onRotateShapeTo && onRotateShapeTo(value);
    }

    render() {
        const { arc } = this.props;

        return (
            <div className="arc-menu menu">
                <div className="menu-title">Arc</div>
                <div className="menu-row">
                    <div className="menu-row-title">Rotation:</div>
                    <Input value={arc.info.rotation} label="Rotation" onChange={this.handleRotationChange} />
                </div>
                <div className="menu-row">
                    <div className="menu-row-title">Stroke:</div>
                    <Select value={arc.strokeWidth} style={{ width: 90 }} onChange={this.handleStrokeWidthChange}>
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                        <option value="20">20</option>
                    </Select>
                </div>
            </div>
        );
    }
}

export default ArcMenu;
