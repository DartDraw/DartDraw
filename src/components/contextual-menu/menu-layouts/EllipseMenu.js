import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './menu-layouts.css';

class EllipseMenu extends Component {
    static propTypes = {
        ellipse: PropTypes.object,
        onEdit: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.handleStrokeWidth = this.handleStrokeWidth.bind(this);
    }

    handleStrokeWidth(event) {
        const { ellipse, onEdit } = this.props;
        const newEllipse = Object.assign({}, ellipse, { strokeWidth: event.target.value });
        onEdit && onEdit(newEllipse);
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
            </div>
        );
    }
}

export default EllipseMenu;