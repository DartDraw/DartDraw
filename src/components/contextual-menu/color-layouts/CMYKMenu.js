import React, { Component } from 'react';
import PropTypes from 'prop-types';

class CMYKMenu extends Component {
    static propTypes = {
        currentColor: PropTypes.object,
        handleColorUpdate: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.handleColorUpdate = this.handleColorUpdate.bind(this);
    }

    handleColorUpdate() {
        console.log("changing color");
    }

    render() {
        return (
            <div className="color-menu">
                <p>Fill Color:</p>
                <input type="text" value="test" />
                <p>R: {this.props.currentColor.r}<input type="text" value={this.props.currentColor.r} /></p>
                <p>G: <input type="text" value={this.props.currentColor.g} /></p>
                <p>B: <input type="text" value={this.props.currentColor.b} onChange={this.handleColorUpdate} /></p>
            </div>
        );
    }
}

export default CMYKMenu;
