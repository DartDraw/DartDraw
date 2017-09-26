import React, { Component } from 'react';
import clickdrag from 'react-clickdrag';
import PropTypes from 'prop-types';
import './menu.css';

class ToolButton extends Component {
    static propTypes = {
      active: React.propTypes.bool,
      imgSrc: React.PropTypes.string,
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="button-container">
                <button><img src={this.props.imgSrc} alt="cursor" id="button-icon"/></button>
            </div>
        );
    }
}

export default ToolButton;
