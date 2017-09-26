import React, { Component } from 'react';
import clickdrag from 'react-clickdrag';
import PropTypes from 'prop-types';
import './menu.css';

class Menu extends Component {
    static propTypes = {
    };

    constructor(props) {
        super(props);

    }

    render() {
        return (
            <div id="top-bar">
                <button><img src="./assets/001-cursor.svg" alt="cursor" id="button-icon"/></button>
            </div>
        );
    }
}

export default Menu;
