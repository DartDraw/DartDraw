import 'react-select/dist/react-select.css';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CustomPicker } from 'react-color';
var { EditableInput, Alpha, Hue } = window.require('react-color/lib/components/common');

class DDColorPicker extends Component {
    static propTypes = {
        onChange: PropTypes.func,
        hex: PropTypes.string,
        hsl: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    render() {
        const styles = {
            hue: {
                height: 10,
                position: 'relative',
                marginBottom: 10
            },
            input: {
                height: 34,
                border: `1px solid ${this.props.hex}`,
                paddingLeft: 10
            },
            swatch: {
                width: 54,
                height: 38,
                background: this.props.hex
            }
        };
        return (
            <div className="color-editor">
                <p>Custom Picker</p>
                <div style={styles.hue}>
                    <Hue hsl={this.props.hsl} onChange={this.props.onChange} />
                </div>
                <div style={styles.input}>
                    <EditableInput
                        value={this.props.hex}
                        onChange={this.props.onChange}
                    />
                </div>
                <div style={styles.swatch} />
            </div>
        );
    }
}

export default CustomPicker(DDColorPicker);
