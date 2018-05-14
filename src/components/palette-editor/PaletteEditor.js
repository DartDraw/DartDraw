import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './palette-menu.css';
import ColorSquare from './ColorSquare';
import { Select } from '../ui';

class PaletteEditor extends Component {
    static propTypes = {
        currentColor: PropTypes.object,
        palettes: PropTypes.object,
        currentPalette: PropTypes.string,
        onSelectColor: PropTypes.func,
        onSelectPalette: PropTypes.func,
        onAddPalette: PropTypes.func,
        onRemoveColor: PropTypes.func,
        onAddColor: PropTypes.func,
        onDeletePalette: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.state = {
            showNewPaletteCreate: false,
            paletteName: '',
            deleteMode: false
        };

        this.handleColorClick = this.handleColorClick.bind(this);
        this.handleChangePalette = this.handleChangePalette.bind(this);
        this.handleAddPalette = this.handleAddPalette.bind(this);
        this.toggleCreatePalette = this.toggleCreatePalette.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.keydownHandler = this.keydownHandler.bind(this);
        this.handleAddColor = this.handleAddColor.bind(this);
        this.handleDeletePalette = this.handleDeletePalette.bind(this);
    }

    componentDidMount() {
        document.addEventListener('keydown', this.keydownHandler);
    }

    keydownHandler(e) {
        if (e.ctrlKey && !this.state.deleteMode) {
            console.log('delete mode on');
            this.setState({deleteMode: true});
        } else {
            this.setState({deleteMode: false});
        }
    }

    handleColorClick(color) {
        if (!this.state.deleteMode) {
            this.props.onSelectColor(color);
        } else {
            this.props.onRemoveColor(color);
        }
    }

    handleChangePalette(paletteName) {
        this.props.onSelectPalette(paletteName);
    }
    handleAddPalette(event) {
        event.preventDefault();
        this.props.onAddPalette(this.state.paletteName);
        this.toggleCreatePalette();
        this.props.onSelectPalette(this.state.paletteName);
    }

    toggleCreatePalette() {
        let show = !this.state.showNewPaletteCreate;
        this.setState({showNewPaletteCreate: show});
    }

    handleNameChange(event) {
        this.setState({'paletteName': event.target.value});
    }

    handleAddColor() {
        this.props.onAddColor(this.props.currentColor);
    }

    handleDeletePalette() {
        const { dialog } = window.require('electron').remote;
        // cancel = 1, yes = 0
        if (dialog.showMessageBox({options: ["warning"], message: 'Are you sure you want to delete the current palette?', buttons: ['Yes', 'Cancel']}) === 0) {
            this.props.onDeletePalette(this.props.currentPalette);
        }
    }

    render() {
        const { palettes, currentPalette } = this.props;
        const colorList = palettes[currentPalette].colors;
        let deleteColorStyle = {};
        if (this.state.deleteMode) {
            deleteColorStyle = {
                marginLeft: '-17px'
            };
        } else {
            deleteColorStyle = {
                display: 'none'
            };
        }
        const palette = colorList.map((color) =>
            <div id="color-square">
                <ColorSquare color={color.rgba} colorClick={this.handleColorClick} />
                <p style={deleteColorStyle}>x</p>
            </div>
        );
        let newPalette = null;
        let paletteStyle = null;
        if (this.state.showNewPaletteCreate) {
            newPalette = <div>
                <form onSubmit={this.handleAddPalette} >
                    <input type="text" onChange={this.handleNameChange} style={{width: '200px', backgroundColor: '#5C7080', textAlign: 'left'}} />
                    <button id="basic-button">Create</button>
                </form>
            </div>;
        } else {
            newPalette = <div />;
        }
        return (
            <div className="color-editor">
                <div id="inline-apart">
                    <div id="inline-close">
                        <label>Palette:</label>
                        <button id="basic-button" onClick={this.toggleCreatePalette}>Create new Palette</button>
                    </div>

                    <button id="basic-button" onClick={this.handleDeletePalette}>Delete</button>
                </div>
                <Select value={currentPalette} onChange={this.handleChangePalette}>
                    {Object.keys(palettes).map((p) => {
                        return <option value={p}>{p}</option>;
                    })}
                </Select>
                {newPalette}
                <div id="palette">
                    { palette }
                    <div onClick={this.handleAddColor}>+</div>
                </div>
            </div>
        );
    }
}

export default PaletteEditor;
