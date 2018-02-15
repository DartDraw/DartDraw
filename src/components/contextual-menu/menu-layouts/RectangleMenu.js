import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './menu-layouts.css';

class RectangleMenu extends Component {
    static propTypes = {
        rectangle: PropTypes.object,
        onEdit: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.handleXChange = this.handleXChange.bind(this);
        this.handleYChange = this.handleYChange.bind(this);
        this.handleStrokeWidth = this.handleStrokeWidth.bind(this);
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

                <input value={this.props.rectangle.x} />
                <input value={this.props.rectangle.y} />
            </div>
        );
    }
}

export default RectangleMenu;
