import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './left-menu.css';

class LeftMenu extends Component {
    static propTypes = {
        onToolSelect: PropTypes.func
        // onExportSelect: PropTypes.func
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
        // this.props.onExportSelect();
        return;
    }

    render() {
        return (
            <div id="left-bar">
                <div id="basic-buttons">
                    <button onClick={() => this.handleToolSelect("selectTool")}>
                        <img src="./assets/001-cursor.svg" alt="select" id="button-icon" />
                    </button>
                    <button onClick={() => this.handleToolSelect("panTool")} >
                        <img src="./assets/scrollarrows.svg" alt="pan" id="button-icon" />
                    </button>
                    <button onClick={() => this.handleToolSelect("rotateTool")}>
                        <img src="./assets/rotate.svg" alt="rotate" id="button-icon" />
                    </button>
                    <div id="separator" />

                    <button onClick={() => this.handleToolSelect("rectangleTool")}>
                        <img src="./assets/rectangle.svg" alt="rect" id="button-icon" />
                    </button>
                    <button onClick={() => this.handleToolSelect("roundedRectangleTool")}>
                        <img src="./assets/roundedRect.svg" alt="rect" id="button-icon" />
                    </button>
                    <button onClick={() => this.handleToolSelect("lineTool")}>
                        <img src="./assets/drawline.svg" alt="line" id="button-icon" />
                    </button>
                    <button onClick={() => this.handleToolSelect("ellipseTool")}>
                        <img src="./assets/ellipse.svg" alt="ellipse" id="button-icon" />
                    </button>
                    <button onClick={() => this.handleToolSelect("polygonTool")}>
                        <img src="./assets/hexagon.svg" alt="polygon" id="button-icon" />
                    </button>
                    <button onClick={() => this.handleToolSelect("arcTool")}>
                        <img src="./assets/arc.svg" alt="arc" id="button-icon" />
                    </button>
                    <button onClick={() => this.handleToolSelect("freehandPathTool")}>
                        <img src="./assets/freehand.svg" alt="freehand" id="button-icon" />
                    </button>
                    <button onClick={this.handleExportSelect}>
                        <img src="./assets/export.svg" alt="export" id="button-icon" />
                    </button>

                    <button onClick={() => this.handleToolSelect("zoomTool")}>
                        <img src="./assets/marquee-zoom.svg" alt="marquee zoom" id="button-icon" />
                    </button>
                    <button onClick={() => this.handleToolSelect("textTool")}>
                        <img src="./assets/text.svg" alt="rect" id="button-icon" />
                    </button>
                </div>
            </div>
        );
    }
}

export default LeftMenu;
