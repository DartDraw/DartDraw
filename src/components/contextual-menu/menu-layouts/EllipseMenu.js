import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
    }

    handleStrokeWidth(event) {
        const { ellipse, onEdit } = this.props;
        const newEllipse = Object.assign({}, ellipse, { strokeWidth: event.target.value });
        onEdit && onEdit(newEllipse);
    }

    handleRotationChange(event) {
        const {onRotateShapeTo} = this.props;
        const degree = event.target.value;
        onRotateShapeTo && onRotateShapeTo(degree);
    }

    handleXChange(event) {
        const { ellipse, onMoveShapeTo } = this.props;
        const cx = event.target.value;
        onMoveShapeTo && onMoveShapeTo(cx, ellipse.info.cy);
    }

    handleYChange(event) {
        const { ellipse, onMoveShapeTo } = this.props;
        const cy = event.target.value;
        onMoveShapeTo && onMoveShapeTo(ellipse.info.cx, cy);
    }
    render() {
        return (
            <div className="ellipse-menu">
                <select value={this.props.ellipse.strokeWidth} onChange={this.handleStrokeWidth}>
                    <option value="1">1</option>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                    <option value="20">20</option>
                </select>
                <input default={this.props.ellipse.info.cx} />
                <input default={this.props.ellipse.info.cy} />
                <input default={this.props.ellipse.degree} onChange={this.handleRotationChange} />
            </div>
        );
    }
}

export default EllipseMenu;
