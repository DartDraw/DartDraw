import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select, Input } from '../../ui';
import './menu-layouts.css';

class BezierMenu extends Component {
    static propTypes = {
        bezier: PropTypes.object,
        onEdit: PropTypes.func,
        onRotateShapeTo: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.handleStrokeWidthChange = this.handleStrokeWidthChange.bind(this);
        this.handleRotationChange = this.handleRotationChange.bind(this);
    }

    handleStrokeWidthChange(value) {
        const { bezier, onEdit } = this.props;
        const newBezier = Object.assign({}, bezier, { strokeWidth: value });
        onEdit && onEdit(newBezier);
    }

    handleRotationChange(value) {
        const {onRotateShapeTo} = this.props;
        onRotateShapeTo && onRotateShapeTo(value);
    }

    render() {
        const { bezier } = this.props;

        return (
            <div className="bezier-menu menu">
                <div className="menu-title">Bezier</div>
                <div className="menu-row">
                    <div className="menu-row-title">Rotation:</div>
                    <Input value={bezier.info.rotation} label="Rotation" onChange={this.handleRotationChange} />
                </div>
                <div className="menu-row">
                    <div className="menu-row-title">Stroke:</div>
                    <Select value={bezier.strokeWidth} style={{ width: 90 }} onChange={this.handleStrokeWidthChange}>
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

export default BezierMenu;
