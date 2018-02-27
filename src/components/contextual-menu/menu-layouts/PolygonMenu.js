import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select, Input } from '../../ui';
import './menu-layouts.css';

class PolygonMenu extends Component {
    static propTypes = {
        polygon: PropTypes.object,
        onEdit: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="polygon-menu menu">
                <div className="menu-title">Polygon</div>
            </div>
        );
    }
}

export default PolygonMenu;
