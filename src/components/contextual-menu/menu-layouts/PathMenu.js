import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './menu-layouts.css';

class PathMenu extends Component {
    static propTypes = {
        path: PropTypes.object,
        onEdit: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.handleStrokeDasharrayChange = this.handleStrokeDasharrayChange.bind(this);
    }

    handleStrokeDasharrayChange(event) {
        const { path, onEdit } = this.props;
        const newPath = Object.assign({}, path, { strokeDasharray: event.target.value });
        onEdit && onEdit(newPath);
    }

    render() {
        return (
            <div className="path-menu">
                <select value={this.props.path.strokeDasharray} onChange={this.handleStrokeDasharrayChange}>
                    <option value='5, 5'>Option 1</option>
                    <option value='1, 0'>Option 2</option>
                </select>
            </div>
        );
    }
}

export default PathMenu;
