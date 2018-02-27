import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select, Input } from '../../ui';
import './menu-layouts.css';

class PolylineMenu extends Component {
    static propTypes = {
        polyline: PropTypes.object,
        onEdit: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="polyline-menu menu">
                <div className="menu-title">Polyline</div>
            </div>
        );
    }
}

export default PolylineMenu;
