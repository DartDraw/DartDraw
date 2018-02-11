import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './menu-layouts.css';

class RectangleMenu extends Component {
    static propTypes = {
        rectangle: PropTypes.object,
        onEdit: PropTypes.func,
        onResizeShapeTo: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.handleXChange = this.handleXChange.bind(this);
        this.handleYChange = this.handleYChange.bind(this);
        this.handleStrokeWidth = this.handleStrokeWidth.bind(this);
        this.handleWidthChange = this.handleWidthChange.bind(this);
        this.handleHeightChange = this.handleHeightChange.bind(this);
    }

    handleXChange(event) {
        const { rectangle, onEdit } = this.props;
        const newRectangle = Object.assign({}, rectangle, { x: event.target.value });
        onEdit && onEdit(newRectangle);
    }

    handleYChange(event) {
        const { rectangle, onEdit } = this.props;
        const newRectangle = Object.assign({}, rectangle, { y: event.target.value });
        onEdit && onEdit(newRectangle);
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
                <input value={this.props.rectangle.info.x} />
                <input value={this.props.rectangle.info.y} />
                <input default={this.props.rectangle.info.width} onChange={this.handleWidthChange} />
                <input default={this.props.rectangle.info.height} onChange={this.handleHeightChange} />
            </div>
        );
    }
}

export default RectangleMenu;
