import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextMenu, PathMenu, RectangleMenu } from './menu-layouts';
import './contextual-menu.css';

class ContextualMenu extends Component {
    static propTypes = {
        selectedShape: PropTypes.object,
        editShape: PropTypes.func,
        onGroupClick: PropTypes.func,
        onUngroupClick: PropTypes.func,
        onMoveBackward: PropTypes.func,
        onMoveForward: PropTypes.func,
        onSendToBack: PropTypes.func,
        onBringToFront: PropTypes.func,
        onFlipHorizontal: PropTypes.func,
        onFlipVertical: PropTypes.func,
        onToggleGridSnapping: PropTypes.func,
        onCustomZoom: PropTypes.func,
        scale: PropTypes.number,
        onZoomIn: PropTypes.func,
        onZoomOut: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.state = {
            hidden: false
        };

        this.tempScale = this.props.scale;

        this.toggleMenu = this.toggleMenu.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleGroupClick = this.handleGroupClick.bind(this);
        this.handleUngroupClick = this.handleUngroupClick.bind(this);
        this.handleMoveBackward = this.handleMoveBackward.bind(this);
        this.handleMoveForward = this.handleMoveForward.bind(this);
        this.handleSendToBack = this.handleSendToBack.bind(this);
        this.handleBringToFront = this.handleBringToFront.bind(this);
        this.handleFlipHorizontal = this.handleFlipHorizontal.bind(this);
        this.handleFlipVertical = this.handleFlipVertical.bind(this);
        this.handleToggleGridSnapping = this.handleToggleGridSnapping.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleZoomIn = this.handleZoomIn.bind(this);
        this.handleZoomOut = this.handleZoomOut.bind(this);
        this.handleChange = this.handleChange.bind(this);
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

    handleChange(event) {
        this.tempScale = event.target.value / 100.0;
    }

    handleSubmit(event) {
        this.props.onCustomZoom(this.tempScale);
        event.preventDefault();
    }

    handleToggleGridSnapping(event) {
        this.props.onToggleGridSnapping();
    }

    handleGroupClick() {
        this.props.onGroupClick();
    }

    handleUngroupClick() {
        this.props.onUngroupClick();
    }

    handleMoveForward() {
        this.props.onMoveForward();
    }

    handleMoveBackward() {
        this.props.onMoveBackward();
    }

    handleBringToFront() {
        this.props.onBringToFront();
    }

    handleSendToBack() {
        this.props.onSendToBack();
    }

    handleFlipHorizontal() {
        this.props.onFlipHorizontal();
    }

    handleFlipVertical() {
        this.props.onFlipVertical();
    }

    handleZoomIn() {
        this.props.onZoomIn();
    }

    handleZoomOut() {
        this.props.onZoomOut();
    }

    render() {
        const { selectedShape, scale } = this.props;
        const { hidden } = this.state;
        let menuLayout = null;
        if (selectedShape) {
            if (selectedShape.type === 'text') {
                menuLayout = <TextMenu text={selectedShape} onEdit={this.handleEdit} />;
            } else if (selectedShape.type === 'rectangle') {
                menuLayout = <RectangleMenu rectangle={selectedShape} onEdit={this.handleEdit} />;
            } else if (selectedShape.type === 'line') {
                menuLayout = <PathMenu path={selectedShape} onEdit={this.handleEdit} />;
            }
        }

        return (
            <div className="contextual-menu" style={{ right: hidden ? -352 : 0 }}>
                <div className="hide-button-column">
                    <div className="hide-button" onClick={this.toggleMenu} />
                </div>
                <div className="menu-column">
                    <div className="static-menu">
                        <button onClick={this.handleGroupClick}>
                            <img src="./assets/group.svg" alt="group" id="button-icon" />
                        </button>
                        <button onClick={this.handleUngroupClick}>
                            <img src="./assets/ungroup.svg" alt="ungroup" id="button-icon" />
                        </button>
                        <button onClick={this.handleMoveForward}>
                            <img src="./assets/upone.svg" alt="upone" id="button-icon" />
                        </button>
                        <button onClick={this.handleMoveBackward}>
                            <img src="./assets/backone.svg" alt="downone" id="button-icon" />
                        </button>
                        <button onClick={this.handleSendToBack}>
                            <img src="./assets/SendToBack.svg" alt="backall" id="button-icon" />
                        </button>
                        <button onClick={this.handleBringToFront}>
                            <img src="./assets/BringToFront.svg" alt="frontall" id="button-icon" />
                        </button>
                        <button onClick={this.handleFlipHorizontal}>
                          FH
                        </button>
                        <button onClick={this.handleFlipVertical}>
                          FV
                        </button>
                        <button onClick={this.handleToggleGridSnapping} id="button-icon">G</button>
                    </div>
                    <div className="dynamic-menu">
                        { menuLayout }
                    </div>
                    <div className="zoom-menu">
                        <button onClick={this.handleZoomIn} id="button-icon">+</button>
                        <button onClick={this.handleZoomOut} id="button-icon">-</button>
                        <form id="button-icon" onSubmit={this.handleSubmit}>
                            {Math.round(scale * 100) + "%"} <input type="text" onChange={this.handleChange} />
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default ContextualMenu;
