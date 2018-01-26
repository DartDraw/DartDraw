import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './color-menu.css';
import OpacityEditor from './OpacityEditor';

class ColorMenu extends Component {
    static propTypes = {
        fillColor: PropTypes.object,
        currentColor: PropTypes.object
    };

    constructor(props) {
        super(props);

        this.handleUpdate = this.handleUpdate.bind(this);
    }

    handleUpdate(event) {
        console.log("this event happened here in ColorMenu.js");
    }

    render() {
        const { fillColor, currentColor } = this.props;
        const currentColorStyle = {
            backgroundColor: `rgba(${currentColor.r}, ${currentColor.g}, ${currentColor.b}, ${currentColor.a} )`
        };
        return (
            <div className="color-editor">
                <h1>Color Editor</h1>
                <OpacityEditor currentColor={fillColor} />
                <div style={currentColorStyle} id="current-color-display" />
            </div>
        );
    }
}

export default ColorMenu;
