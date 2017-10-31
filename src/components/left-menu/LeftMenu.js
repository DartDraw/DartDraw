import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './left-menu.css';

class LeftMenu extends Component {
    static propTypes = {
        onToolSelect: PropTypes.func,
        onExportSelect: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.handleToolSelect = this.handleToolSelect.bind(this);
        this.handleExportSelect = this.handleExportSelect.bind(this);
    }

    handleToolSelect(toolType) {
        this.props.onToolSelect(toolType);
    }

    handleExportSelect() {
        this.props.onExportSelect();
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
                    <button onClick={() => this.handleToolSelect("lineTool")}>
                        <img src="./assets/011-drawline.svg" alt="line" id="button-icon" />
                    </button>
                    <button onClick={() => this.handleToolSelect("ellipseTool")}>
                        <img src="./assets/ellipse.svg" alt="ellipse" id="button-icon" />
                    </button>
                    <button onClick={this.handleExportSelect}>
                        <img src="./assets/008-export.svg" alt="export" id="button-icon" />
                    </button>
                    <button onClick={() => this.handleToolSelect("panTool")} >
                        <img src="./assets/010-scrollarrows.svg" alt="pan" id="button-icon" />
                    </button>
                    <button onClick={() => this.handleToolSelect("rotateTool")}>
                        <img src="./assets/rotate.svg" alt="rotate" id="button-icon" />
                    </button>
                </div>
            </div>
        );
    }
}

export default LeftMenu;
