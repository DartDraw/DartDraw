import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './color-editor.css';

class ColorInput extends Component {
    static propTypes = {
        rectangle: PropTypes.object,
        onEdit: PropTypes.func,
        colorMode: PropTypes.string
    };

    constructor(props) {
        super(props);

        this.setColorValues = this.setColorValues.bind(this);
    }

    setColorValues() {
        document.getElementById('c-val').setAttribute('value', 'My default value');
    }

    onComponentDidMount() {
        // this.setColorValues();
        console.log(this.props);
    }

    fillInputFields() {
        if (this.props.colorMode === "RGB") {
            document.getElementById("r-val").value = "hello";
        }
    }

    render() {
        if (this.props.colorMode === "RGB") {
            return (
                <div className="ColorInputForm">
                    <p>R : <input id="r-val" /></p>
                    <p>G : <input id="g-val" /></p>
                    <p>B : <input id="b-val" /></p>
                    <button>Set</button>
                </div>
            );
        } else if (this.props.colorMode === "CMYK") {
            return (
                <div className="ColorInputForm">
                    <p>C : <input id="c-val" /></p>
                    <p>M : <input id="m-val" /></p>
                    <p>Y : <input id="y-val" /></p>
                    <p>K : <input id="k-val" /></p>
                    <button>Set</button>
                </div>
            );
        } else if (this.props.colorMode === "HSL") {
            return (
                <div className="ColorInputForm">
                    <p>H : <input id="h-val" /></p>
                    <p>S : <input id="s-val" /></p>
                    <p>L : <input id="l-val" /></p>
                    <button>Set</button>
                </div>
            );
        } else {
            return (
                <div className="ColorInputForm">
                    <p>Hex : <input id="hex-val" /></p>
                    <button>Set</button>
                </div>
            );
        }
    }
}

export default ColorInput;
