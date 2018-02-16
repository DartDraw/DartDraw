import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './right-scroll.css';

class RightScroll extends Component {
    static propTypes = {
        panX: PropTypes.number,
        panY: PropTypes.number,
        canvasHeight: PropTypes.number,
        maxPanY: PropTypes.number,
        onScroll: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.state = {
            hidden: true
        };

        this.handleScroll = this.handleScroll.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.panX !== this.props.panX || nextProps.panY !== this.props.panY) {
            this.setState({
                hidden: false
            });
            if (this.timeoutTimer) {
                clearTimeout(this.timeoutTimer);
            }
            this.timeoutTimer = setTimeout(() => {
                this.setState({ hidden: true });
            }, 1000);
        }
    }

    handleScroll() {
        const { onScroll } = this.props;
        onScroll && onScroll();
    }

    render() {
        const { panY, maxPanY, canvasHeight } = this.props;
        const { hidden } = this.state;

        const scrollBarHeight = ((1 - maxPanY / canvasHeight) * 100) + '%';
        const scrollBarPosition = (panY / canvasHeight * 100) + '%';

        return (
            <div id="right-scroll-container" style={{ right: hidden ? -18 : 0 }}>
                <div id="right-scroll-bar" style={{ height: scrollBarHeight, top: scrollBarPosition }} />
            </div>
        );
    }
}

export default RightScroll;
