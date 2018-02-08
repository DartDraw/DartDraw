import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ColorSquare extends Component {
    static propTypes = {
        color: PropTypes.object,
        colorClick: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        console.log("testing click");
        // this.props.colorClick(this.props.color);
        this.props.colorClick(this.props.color);
    }

    render() {
        let {color} = this.props;
        const colorSquareStyle = {
            backgroundColor: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`
        };
        return (
            <div className="color-square" style={colorSquareStyle} onClick={this.handleClick} />
        );
    }
}

export default ColorSquare;
