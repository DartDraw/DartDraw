import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './left-menu.css';

class LeftMenu extends Component {
    static propTypes = {
        onToolSelect: PropTypes.func,
        onExportSelect: PropTypes.func,
        toolType: PropTypes.string
    };

    constructor(props) {
        super(props);

        this.handleToolSelect = this.handleToolSelect.bind(this);
        this.handleExportSelect = this.handleExportSelect.bind(this);
        this.isSelected = this.isSelected.bind(this);
    }

    isSelected(tool) {
        const { toolType } = this.props;
        if (toolType === tool) return "selectedTool";
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
                    <button onClick={() => this.handleToolSelect("selectTool")} className={this.isSelected("selectTool")}>
                        <img src="./assets/001-cursor.svg" alt="select" id="button-icon" />
                    </button>
                    <button onClick={() => this.handleToolSelect("panTool")} className={this.isSelected("panTool")}>
                        <img src="./assets/scrollarrows.svg" alt="pan" id="button-icon" />
                    </button>
                    <button onClick={() => this.handleToolSelect("rotateTool")} className={this.isSelected("rotateTool")} >
                        <img src="./assets/rotate.svg" alt="rotate" id="button-icon" />
                    </button>
                    <div id="separator" />
                    <button onClick={() => this.handleToolSelect("rectangleTool")} className={this.isSelected("rectangleTool")}>
                        <img src="./assets/rectangle.svg" alt="rect" id="button-icon" />
                    </button>
                    <button onClick={() => this.handleToolSelect("roundedRectangleTool")} className={this.isSelected("roundedRectangleTool")}>
                        <img src="./assets/roundedRect.svg" alt="rect" id="button-icon" />
                    </button>
                    <button onClick={() => this.handleToolSelect("ellipseTool")} className={this.isSelected("ellipseTool")}>
                        <img src="./assets/ellipse.svg" alt="ellipse" id="button-icon" />
                    </button>
                    <button onClick={() => this.handleToolSelect("polygonTool")} className={this.isSelected("polygonTool")}>
                        <img src="./assets/hexagon.svg" alt="polygon" id="button-icon" />
                    </button>
                    <button onClick={() => this.handleToolSelect("lineTool")} className={this.isSelected("lineTool")}>
                        <img src="./assets/drawline.svg" alt="line" id="button-icon" />
                    </button>
                    <div id="separator" />
                    <button onClick={() => this.handleToolSelect("textTool")} className={this.isSelected("textTool")}>
                        <img src="./assets/text.svg" alt="rect" id="button-icon" />
                    </button>
                    <button onClick={() => this.handleToolSelect("arcTool")} className={this.isSelected("arcTool")}>
                        <img src="./assets/arc.svg" alt="arc" id="button-icon" />
                    </button>
                    <button onClick={() => this.handleToolSelect("freehandPathTool")} className={this.isSelected("freehandPathTool")} >
                        <img src="./assets/freehand.svg" alt="freehand" id="button-icon" />
                    </button>
                    <button onClick={() => this.handleToolSelect("bezierTool")} className={this.isSelected("bezierTool")}>
                        <img src="./assets/bezier.svg" alt="bez" id="button-icon" />
                    </button>
                    <button onClick={this.handleExportSelect}>
                        <img src="./assets/export.svg" alt="export" id="button-icon" />
                    </button>
                </div>
            </div>
        );
    }
}

export default LeftMenu;
