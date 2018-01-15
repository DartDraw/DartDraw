import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CanvasContainer } from './components/drawing';
import { TopMenuContainer } from './components/top-menu';
import { LeftMenuContainer } from './components/left-menu';
import { RulerLayerContainer } from './components/drawing/layers';
import { ContextualMenuContainer } from './components/contextual-menu';

class App extends Component {
    static propTypes = {
        onKeyDown: PropTypes.func,
        onKeyUp: PropTypes.func
    }

    constructor(props) {
        super(props);

        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
    }

    componentDidMount() {
        this.app.focus();
    }

    handleKeyDown(e) {
        const { onKeyDown } = this.props;
        onKeyDown && onKeyDown(e.nativeEvent.keyCode);
    }

    handleKeyUp(e) {
        const { onKeyUp } = this.props;
        onKeyUp && onKeyUp(e.nativeEvent.keyCode);
    }

    render() {
        return (
            <div className="App"
                ref={el => { this.app = el; }}
                onKeyDown={this.handleKeyDown}
                onKeyUp={this.handleKeyUp}
                tabIndex={-1}
            >
                <TopMenuContainer />
                <div className="mainBody">
                    <LeftMenuContainer />
                    <div className="subBody">
                        <RulerLayerContainer dir="horizontal" />
                        <div className="body">
                            <RulerLayerContainer dir="vertical" />
                            <CanvasContainer />
                        </div>
                    </div>
                </div>
                <ContextualMenuContainer />
            </div>
        );
    }
}

export default App;
