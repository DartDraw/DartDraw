import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './left-menu.css';
import ReactTooltip from 'react-tooltip';

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
                <ReactTooltip effect="solid" className="tooltip-style" />
                <div id="basic-buttons">
                    <button onClick={() => this.handleToolSelect("selectTool")} data-tip="Select" className={this.isSelected("selectTool")}>
                        <img src="./assets/001-cursor.svg" alt="select" id="button-icon" />
                    </button>
                    <button onClick={() => this.handleToolSelect("panTool")} data-tip="Pan" className={this.isSelected("panTool")}>
                        <img src="./assets/scrollarrows.svg" alt="pan" id="button-icon" />
                    </button>
                    <button onClick={() => this.handleToolSelect("rotateTool")} data-tip="Rotate" className={this.isSelected("rotateTool")} >
                        <img src="./assets/rotate.svg" alt="rotate" id="button-icon" />
                    </button>
                    <span className="separator" />
                    <button onClick={() => this.handleToolSelect("rectangleTool")} data-tip="Rectangle" className={this.isSelected("rectangleTool")}>
                        <img src="./assets/rectangle.svg" alt="rect" id="button-icon" />
                    </button>
                    <button onClick={() => this.handleToolSelect("roundedRectangleTool")} data-tip="Rounded Rectangle" className={this.isSelected("roundedRectangleTool")}>
                        <img src="./assets/roundedRect.svg" alt="rect" id="button-icon" />
                    </button>
                    <button onClick={() => this.handleToolSelect("ellipseTool")} data-tip="Ellipse" className={this.isSelected("ellipseTool")}>
                        <img src="./assets/ellipse.svg" alt="ellipse" id="button-icon" />
                    </button>
                    <button onClick={() => this.handleToolSelect("polygonTool")} data-tip="Polygon" className={this.isSelected("polygonTool")}>
                        <img src="./assets/hexagon.svg" alt="polygon" id="button-icon" />
                    </button>
                    <span className="separator" />
                    <button onClick={() => this.handleToolSelect("lineTool")} data-tip="Line" className={this.isSelected("lineTool")}>
                        <img src="./assets/drawline.svg" alt="line" id="button-icon" />
                    </button>
                    <button onClick={() => this.handleToolSelect("textTool")} data-tip="Text" className={this.isSelected("textTool")}>
                        <img src="./assets/text.svg" alt="rect" id="button-icon" />
                    </button>
                    <button onClick={() => this.handleToolSelect("arcTool")} data-tip="Arc" className={this.isSelected("arcTool")}>
                        <img src="./assets/arc.svg" alt="arc" id="button-icon" />
                    </button>
                    <button onClick={() => this.handleToolSelect("freehandPathTool")} data-tip="Freehand Path" className={this.isSelected("freehandPathTool")} >
                        <img src="./assets/freehand.svg" alt="freehand" id="button-icon" />
                    </button>
                    <button onClick={() => this.handleToolSelect("bezierTool")} data-tip="Bezier Curve" className={this.isSelected("bezierTool")}>
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
