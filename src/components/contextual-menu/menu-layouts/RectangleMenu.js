import React, { Component } from 'react';
import PropTypes from 'prop-types';
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

    handleXChange(event) {
        const { rectangle, onMoveShapeTo } = this.props;
        const x = event.target.value;
        onMoveShapeTo && onMoveShapeTo(x, rectangle.info.y);
    }

    handleYChange(event) {
        const { rectangle, onMoveShapeTo } = this.props;
        const y = event.target.value;
        onMoveShapeTo && onMoveShapeTo(rectangle.info.x, y);
    }

    handleStrokeWidth(event) {
        const { rectangle, onEdit } = this.props;
        if (event.target.value > 0) {
            const newRectangle = Object.assign({}, rectangle, { strokeWidth: event.target.value });
            onEdit && onEdit(newRectangle);
        }
    }

    handleWidthChange(event) {
        const {onResizeShapeTo} = this.props;
        const width = event.target.value;
        onResizeShapeTo && onResizeShapeTo(width);
    }

    handleHeightChange(event) {
        const {rectangle, onResizeShapeTo} = this.props;
        const height = event.target.value;
        onResizeShapeTo && onResizeShapeTo(rectangle.info.width, height);
    }

    handleRotationChange(event) {
        const {onRotateShapeTo} = this.props;
        const degree = event.target.value;
        onRotateShapeTo && onRotateShapeTo(degree);
    }

    render() {
        return (
            <div className="rectangle-menu">
                <select value={this.props.rectangle.strokeWidth} onChange={this.handleStrokeWidth}>
                    <option value="1">1</option>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                    <option value="20">20</option>
                </select>
                <input default={this.props.rectangle.info.x} onChange={this.handleXChange} />
                <input default={this.props.rectangle.info.y} onChange={this.handleYChange} />
                <input default={this.props.rectangle.info.width} onChange={this.handleWidthChange} />
                <input default={this.props.rectangle.info.height} onChange={this.handleHeightChange} />
                <input default={this.props.rectangle.degree} onChange={this.handleRotationChange} />
            </div>
        );
    }
}

export default RectangleMenu;
