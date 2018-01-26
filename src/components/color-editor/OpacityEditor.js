import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './color-menu.css';

class OpacityEditor extends Component {
    static propTypes = {
        currentOpacity: PropTypes.number,
        onUpdateOpacity: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.tempOpacityValue = this.props.currentOpacity;

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.tempOpacityValue = event.target.value / 100.0;
        this.props.onUpdateOpacity(this.tempOpacityValue);
        console.log(this.tempOpacityValue);
        // console.log(event);
    }

    handleSubmit(event) {
        this.props.onUpdateOpacity(this.tempOpacityValue);
        event.preventDefault();
    }

    handleUpdateOpacity() {
    }

    render() {
        const tempValue = this.props.currentOpacity;
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <input type="range" min="1" max="100" value={this.tempValue} step="1" onChange={this.handleChange} />
                    <input type="text" value={this.tempOpacityValue * 100.0} onChange={this.handleChange} />
                </form>
            </div>
        );
    }
}

export default OpacityEditor;
