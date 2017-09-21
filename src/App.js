import React, { Component } from 'react';
import { CanvasContainer } from './components/drawing';

class App extends Component {
    render() {
        return (
            <div className="App">
                <CanvasContainer />
            </div>
        );
    }
}

export default App;
