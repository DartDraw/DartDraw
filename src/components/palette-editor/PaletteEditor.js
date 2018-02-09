import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './palette-menu.css';
import ColorSquare from './ColorSquare';
import Dropdown from 'react-dropdown';

class PaletteEditor extends Component {
    static propTypes = {
        currentColor: PropTypes.object,
        palettes: PropTypes.object,
        currentPalette: PropTypes.string,
        onSelectColor: PropTypes.func,
        onSelectPalette: PropTypes.func,
        onAddPalette: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.state = {
            showNewPaletteCreate: false,
            paletteName: ''

        };

        this.handleColorClick = this.handleColorClick.bind(this);
        this.handleChangePalette = this.handleChangePalette.bind(this);
        this.handleAddPalette = this.handleAddPalette.bind(this);
        this.toggleCreatePalette = this.toggleCreatePalette.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
    }

    handleColorClick(color) {
        console.log(Object.keys(this.props.palettes));
        this.props.onSelectColor(color);
    }

    handleChangePalette(paletteName) {
        console.log(paletteName);
        this.props.onSelectPalette(paletteName.value);
    }
    handleAddPalette(event) {
        event.preventDefault();
        console.log(this.state.paletteName);
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

    render() {
        // const colorList = this.getCurrentColorList();
        const { palettes, currentPalette } = this.props;
        const colorList = palettes[currentPalette].colors;
        const palette = colorList.map((color) =>
            <ColorSquare color={color} colorClick={this.handleColorClick} />
        );
        let newPalette = null;
        if (this.state.showNewPaletteCreate) {
            newPalette = <div>
                <form onSubmit={this.handleAddPalette}>
                    <input type="text" onChange={this.handleNameChange} style={{width: '200px', backgroundColor: '#5C7080', textAlign: 'left'}} />
                    <button id="basic-button">Create</button>
                </form>
            </div>;
        } else {
            newPalette = <div />;
        }
        return (
            <div className="color-editor">
                <div id="inline-close">
                    <label>Palette:</label>
                    <Dropdown id="dropwdown" options={Object.keys(palettes)} onChange={(e) => { this.handleChangePalette(e); }} value={currentPalette} placeholder="Select an option" />
                    <button id="basic-button" onClick={this.toggleCreatePalette}>Create new Palette</button>
                </div>
                {newPalette}
                <div id="palette">
                    { palette }
                </div>
            </div>
        );
    }
}

export default PaletteEditor;
