import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './bottom-scroll.css';

class BottomScroll extends Component {
    static propTypes = {
        panX: PropTypes.number,
        panY: PropTypes.number,
        canvasWidth: PropTypes.number,
        maxPanX: PropTypes.number,
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
        const { panX, maxPanX, canvasWidth } = this.props;
        const { hidden } = this.state;

        const scrollBarWidth = ((1 - maxPanX / canvasWidth) * 100) + '%';
        const scrollBarPosition = (panX / canvasWidth * 100) + '%';

        return (
            <div id="bottom-scroll-container" style={{ bottom: hidden ? -18 : 0 }}>
                <div id="bottom-scroll-bar" style={{ width: scrollBarWidth, left: scrollBarPosition }} />
            </div>
        );
    }
}

export default BottomScroll;
