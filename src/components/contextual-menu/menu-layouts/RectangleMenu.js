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

    render() {
        return (
            <div className="rectangle-menu">
                <input value={this.props.rectangle.x} />
                <input value={this.props.rectangle.y} />
            </div>
        );
    }
}

export default RectangleMenu;
