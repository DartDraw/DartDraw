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
            <div id="menu-container">
                <button>Select</button>
                <button>Draw Rect</button>
                <button>UNDO</button>
                <button>REDO</button>
            </div>
        );
    }
}

export default clickdrag(Menu);
