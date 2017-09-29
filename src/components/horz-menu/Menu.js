import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './menu.css';

class Menu extends Component {
    static propTypes = {
      onUndoClick: PropTypes.func,
      onRedoClick: PropTypes.func,
      onToolSelect: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.handleUndoClick = this.handleUndoClick.bind(this);
        this.handleRedoClick = this.handleRedoClick.bind(this);
        this.handleToolSelect = this.handleToolSelect.bind(this);
    }

    handleUndoClick() {
        this.props.onUndoClick();
    }

    handleRedoClick() {
        this.props.onRedoClick();
    }

    handleToolSelect(toolType) {
        this.props.onToolSelect(toolType);
    }

    render() {
        return (
            <div id="top-bar">
                <button onClick={this.handleToolSelect("select")}>
                  <img src="./assets/001-cursor.svg" alt="select" id="button-icon"/>
                </button>
                <button onClick={this.handleToolSelect("rectangle")}>
                  <img src="./assets/002-frame.svg" alt="rect" id="button-icon"/>
                </button>
                <button onClick={this.handleUndoClick}>
                  <img src="./assets/004-undo.svg" alt="undo" id="button-icon"/>
                </button>
                <button onClick={this.handleRedoClick}>
                  <img src="./assets/003-redo.svg" alt="redo" id="button-icon"/>
                </button>
            </div>
        );
    }
}

export default Menu;
