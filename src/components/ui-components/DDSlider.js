import React, { Component } from 'react';
import PropTypes from 'prop-types';

class DDSlider extends Component {
    static propTypes = {
        sliderVal: PropTypes.number,
        inputVal: PropTypes.number,
        onChangeFunc: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.tempValue = this.props.sliderVal;
    }

    handleSubmit(event) {
        event.preventDefault();
    }

    handleChange(event) {
        // on edit function to propogate it up
        this.onChangeFunc(event.target.value);
    }

    render() {
        return (
            <div className="dd-slider">
                <form onSubmit={this.handleSubmit}>
                    <input type="range" min="1" max="100" value={this.tempValue} defaultValue="100" step="1" onChange={this.handleChange} />
                    <input type="text" value={this.tempValue * 100.0} onChange={this.handleChange} />
                </form>
            </div>
        );
    }
}

export default DDSlider;
