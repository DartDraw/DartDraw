import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextMenu, PathMenu, RectangleMenu, EllipseMenu } from './menu-layouts';
import { ColorMenuContainer } from '../color-editor';
import { PaletteEditorContainer } from '../palette-editor';
import './contextual-menu.css';

class ContextualMenu extends Component {
    static propTypes = {
        selectedShape: PropTypes.object,
        scale: PropTypes.number,
        unitType: PropTypes.string,
        unitDivisions: PropTypes.number,
        canvasWidthInUnits: PropTypes.number,
        canvasHeightInUnits: PropTypes.number,
        editShape: PropTypes.func,
        fillColor: PropTypes.object,
        onSetCustomZoom: PropTypes.func,
        onShowGrid: PropTypes.func,
        onShowRulers: PropTypes.func,
        onShowSubDivisions: PropTypes.func,
        onSetRulerGrid: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.state = {
            hidden: false
        };

        this.toggleMenu = this.toggleMenu.bind(this);
        this.handleEdit = this.handleEdit.bind(this);

        this.handleZoomIn = this.handleZoomIn.bind(this);
        this.handleZoomOut = this.handleZoomOut.bind(this);
        this.handleShowGrid = this.handleShowGrid.bind(this);
        this.handleShowRulers = this.handleShowRulers.bind(this);
        this.handleShowSubDivisions = this.handleShowSubDivisions.bind(this);
        this.handleSubmitCustomZoom = this.handleSubmitCustomZoom.bind(this);
        this.handleSubmitRulerGrid = this.handleSubmitRulerGrid.bind(this);
    }

    toggleMenu() {
        const { hidden } = this.state;
        this.setState({
            hidden: !hidden
        });
    }

    handleEdit(shape) {
        const { editShape } = this.props;
        editShape && editShape(shape);
    }

    handleZoomIn() {
        this.props.onSetCustomZoom(this.props.scale * 2);
    }

    handleZoomOut() {
        this.props.onSetCustomZoom(this.props.scale / 2);
    }

    handleShowRulers() {
        this.props.onShowRulers();
    }

    handleShowGrid() {
        this.props.onShowGrid();
    }

    handleShowSubDivisions() {
        this.props.onShowSubDivisions();
    }

    handleSubmitCustomZoom(event) {
        this.props.onSetCustomZoom(parseFloat(document.getElementById("scale").value) / 100.0);
        event.preventDefault();
    }

    handleSubmitRulerGrid(event) {
        this.props.onSetRulerGrid({
            unitType: document.getElementById("unitType").value,
            width: document.getElementById("width").value,
            height: document.getElementById("height").value,
            unitDivisions: document.getElementById("unitDivisions").value
        });
        event.preventDefault();
    }

    render() {
        const { selectedShape, scale, unitType, unitDivisions, canvasWidthInUnits, canvasHeightInUnits } = this.props;
        const { hidden } = this.state;
        let menuLayout = null;
        let colorLayout = null;
        if (selectedShape) {
            if (selectedShape.type === 'text') {
                menuLayout = <TextMenu text={selectedShape} onEdit={this.handleEdit} />;
            } else if (selectedShape.type === 'rectangle') {
                menuLayout = <RectangleMenu rectangle={selectedShape} onEdit={this.handleEdit} />;
            } else if (selectedShape.type === 'line') {
                menuLayout = <PathMenu path={selectedShape} onEdit={this.handleEdit} />;
            } else if (selectedShape.type === 'ellipse') {
                menuLayout = <EllipseMenu ellipse={selectedShape} onEdit={this.handleEdit} />;
            }
        }

        return (
            <div className="contextual-menu" style={{ right: hidden ? -352 : 0 }}>
                <div className="hide-button-column">
                    <div className="hide-button" onClick={this.toggleMenu} />
                </div>
                <div className="menu-column">
                    <ColorMenuContainer />
                    <PaletteEditorContainer />
                    <div className="dynamic-menu">
                        { menuLayout }
                    </div>
                    <div className="temp">
                        <button onClick={this.handleShowRulers} id="button-icon">R</button>
                        <button onClick={this.handleShowGrid} id="button-icon">G</button>
                        <button onClick={this.handleShowSubDivisions} id="button-icon">S</button>
                    </div>
                    <div className="ruler-menu">
                        <form id="button-icon" onSubmit={this.handleSubmitRulerGrid}>
                            <select
                                id="unitType"
                                defaultValue={unitType}
                            >
                                <option value="in">{"in"}</option>
                                <option value="ft">ft</option>
                                <option value="mm">mm</option>
                                <option value="cm">cm</option>
                                <option value="m">m</option>
                                <option value="px">px</option>
                                <option value="pt">pt</option>
                            </select>
                            <input
                                id="width"
                                defaultValue={canvasWidthInUnits}
                                type="number"
                                step="0.01"
                            />
                            <input
                                id="height"
                                defaultValue={canvasHeightInUnits}
                                type="number"
                                step="0.01"
                            />
                            <input
                                id="unitDivisions"
                                defaultValue={unitDivisions}
                                type="number"
                            />
                            <input type="submit" value="resize" />
                        </form>
                    </div>
                    <div className="zoom-menu">
                        <button onClick={this.handleZoomIn} id="button-icon">+</button>
                        <button onClick={this.handleZoomOut} id="button-icon">-</button>
                        <form id="button-icon" onSubmit={this.handleSubmitCustomZoom}>
                            {Math.round(scale * 100.0) + "% "}
                            <input
                                id="scale"
                                defaultValue={Math.round(scale * 100.0)}
                                type="number"
                            />
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default ContextualMenu;
