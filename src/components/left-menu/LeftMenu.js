import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './left-menu.css';

class LeftMenu extends Component {
    static propTypes = {
        onToolSelect: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.handleToolSelect = this.handleToolSelect.bind(this);
    }

    handleToolSelect(toolType) {
        this.props.onToolSelect(toolType);
    }

    render() {
        return (
            <div id="left-bar">
              <div id="basic-buttons">
                <button onClick={() => this.handleToolSelect("selectTool")}>
                    <img src="./assets/001-cursor.svg" alt="select" id="button-icon" />
                </button>
                <button onClick={() => this.handleToolSelect("rectangleTool")}>
                    <img src="./assets/002-frame.svg" alt="rect" id="button-icon" />
                </button>
                <button onClick={() => this.handleToolSelect("groupTool")}>
                  <img src="./assets/005-group.svg" alt="group" id="button-icon" />
                </button>
              </div>
            </div>
        );
    }
}

export default LeftMenu;
