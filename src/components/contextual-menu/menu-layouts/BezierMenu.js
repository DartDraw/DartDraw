import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select, Input } from '../../ui';
import './menu-layouts.css';

class BezierMenu extends Component {
    static propTypes = {
        bezier: PropTypes.object,
        onEdit: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="bezier-menu menu">
                <div className="menu-title">Bezier</div>
            </div>
        );
    }
}

export default BezierMenu;
