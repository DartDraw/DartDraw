import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Draggable } from '../shared';
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
            dragging: false,
            hidden: true
        };

        this.handleDragStart = this.handleDragStart.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
        this.handleDragStop = this.handleDragStop.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (!this.state.dragging) {
            if (nextProps.panX !== this.props.panX || nextProps.panY !== this.props.panY) {
                this.setState({
                    hidden: false
                });
                if (this.timeoutTimer) {
                    clearTimeout(this.timeoutTimer);
                }
                this.timeoutTimer = setTimeout(() => {
                    this.setState({ hidden: true });
                }, 2000);
            }
        }
    }

    handleDragStart() {
        clearTimeout(this.timeoutTimer);
        this.setState({
            dragging: true
        });
    }

    handleDrag(draggableData) {
        const { onScroll } = this.props;
        onScroll && onScroll(draggableData.deltaX, 0);
    }

    handleDragStop() {
        this.setState({
            dragging: false
        });
        this.timeoutTimer = setTimeout(() => {
            this.setState({ hidden: true });
        }, 2000);
    }

    render() {
        const { panX, maxPanX, canvasWidth } = this.props;
        const { hidden } = this.state;

        const scrollBarWidth = ((1 - maxPanX / canvasWidth) * 100) + '%';
        const scrollBarPosition = (panX / canvasWidth * 100) + '%';

        return (
            <div id="bottom-scroll-container" style={{ bottom: hidden ? -18 : 0 }}>
                <Draggable onStart={this.handleDragStart} onDrag={this.handleDrag} onStop={this.handleDragStop}>
                    <div id="bottom-scroll-bar" style={{ width: scrollBarWidth, left: scrollBarPosition }} />
                </Draggable>
            </div>
        );
    }
}

export default BottomScroll;
