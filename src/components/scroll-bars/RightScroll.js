import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Draggable } from '../shared';
import { CONTEXTUAL_MENU_WIDTH, SCROLL_BAR_WIDTH } from '../../constants';
import './right-scroll.css';

class RightScroll extends Component {
    static propTypes = {
        panX: PropTypes.number,
        panY: PropTypes.number,
        canvasHeight: PropTypes.number,
        maxPanY: PropTypes.number,
        contextualMenuVisible: PropTypes.bool,
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
        onScroll && onScroll(0, draggableData.deltaY);
    }

    handleDragStop() {
        this.setState({
            dragging: false
        });
        this.timeoutTimer = setTimeout(() => {
            this.setState({ hidden: true });
        }, 2000);
    }

    handleScroll() {
        const { onScroll } = this.props;
        onScroll && onScroll();
    }

    render() {
        const { panY, maxPanY, canvasHeight, contextualMenuVisible } = this.props;
        const { hidden } = this.state;

        let containerPosition = hidden ? -SCROLL_BAR_WIDTH : 0;
        if (contextualMenuVisible) {
            containerPosition += CONTEXTUAL_MENU_WIDTH;
        }
        const scrollBarHeight = ((1 - maxPanY / canvasHeight) * 100) + '%';
        const scrollBarPosition = (panY / canvasHeight * 100) + '%';

        return (
            <div id="right-scroll-container" style={{ width: SCROLL_BAR_WIDTH, right: containerPosition }}>
                <Draggable onStart={this.handleDragStart} onDrag={this.handleDrag} onStop={this.handleDragStop}>
                    <div id="right-scroll-bar" style={{ height: scrollBarHeight, top: scrollBarPosition }} />
                </Draggable>
            </div>
        );
    }
}

export default RightScroll;
