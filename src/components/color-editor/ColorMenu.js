import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './color-editor.css';
import ColorInput from './ColorInput';

class ColorMenu extends Component {
    static propTypes = {
        rectangle: PropTypes.object,
        onEdit: PropTypes.func,
        aProp: PropTypes.string,
        fillColor: PropTypes.object,
        color: PropTypes.object,
        onChangeColorMode: PropTypes.func,
        colorMode: PropTypes.string
    };

    constructor(props) {
        super(props);

        this.setColorValues = this.setColorValues.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    setColorValues() {
        document.getElementById('r-val').setAttribute('value', this.props.fillColor.r);
    }

    handleChange(event) {
        console.log("Target value: " + event.target.value);
        console.log("Color mode: " + this.props);
        console.log(this.props);
        // this.props.onChangeColorMode(event.target.value);
        // this.setState({colorMode: event.target.value});
    }

    render() {
        return (
            <div>
                <div className="ColorMenu">
                    <div className="ColorMenu-title">
                        <h1>Color Menu</h1>
                        <p>{this.props.fillColor.r}</p>
                        <select onChange={this.handleChange}>
                            <option value="RGB">RGB</option>
                            <option value="CMYK">CMYK</option>
                            <option value="Hex">Hex</option>
                            <option value="HSL">HSL</option>
                        </select>
                    </div>
                    <ColorInput colorMode={this.props.colorMode} />
                </div>
            </div>
        );
    }
}

export default ColorMenu;
