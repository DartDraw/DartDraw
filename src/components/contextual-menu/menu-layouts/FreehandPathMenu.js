import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select, Input } from '../../ui';
import './menu-layouts.css';

class FreehandPathMenu extends Component {
    static propTypes = {
        freehandPath: PropTypes.object,
        onEdit: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="freehandPath-menu menu">
                <div className="menu-title">FreehandPath</div>
            </div>
        );
    }
}

export default FreehandPathMenu;
