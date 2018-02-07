import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ColorSquare from './ColorSquare';

class ColorList extends Component {
    static propTypes = {
        colorList: PropTypes.array
    };

    constructor(props) {
        super(props);
    }

    render() {
        let { colorList } = this.props;
        const palette = colorList.map((color) =>
            <ColorSquare color={color} />
        );
        return (
            <div>{palette}</div>
        );
    }
}

export default ColorList;
