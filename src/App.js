import React, { Component } from 'react';
import { CanvasContainer } from './components/drawing';
import { MenuContainer } from './components/menu';

class App extends Component {
    render() {
        return (
            <div className="App">
                <MenuContainer />
                <CanvasContainer />
            </div>
        );
    }
}

export default App;
