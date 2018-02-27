import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select, Input } from '../../ui';
import './menu-layouts.css';

class ArcMenu extends Component {
    static propTypes = {
        arc: PropTypes.object,
        onEdit: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="arc-menu menu">
                <div className="menu-title">Arc</div>
            </div>
        );
    }
}

export default ArcMenu;
