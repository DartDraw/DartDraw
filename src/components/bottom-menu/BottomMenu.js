import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './bottom-menu.css';

class TopMenu extends Component {
    static propTypes = {
        scrollX: PropTypes.number,
        onScroll: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.handleScroll = this.handleScroll.bind(this);
    }

    handleScroll() {
        const { onScroll } = this.props;
        onScroll && onScroll();
    }

    render() {
        const { scrollX } = this.props;

        return (
            <div id="bottom-bar" />
        );
    }
}

export default TopMenu;
