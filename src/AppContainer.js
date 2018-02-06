import { connect } from 'react-redux';
import { keyUp, keyDown, mouseMove } from './actions/menu';
import App from './App';

const mapDispatchToProps = (dispatch) => {
    return {
        onKeyDown: (keyCode) => {
            dispatch(keyDown(keyCode));
        },
        onKeyUp: (keyCode) => {
            dispatch(keyUp(keyCode));
        },
        onMouseMove: (coord) => {
            dispatch(mouseMove(coord));
        }
    };
};

export default connect(
    undefined,
    mapDispatchToProps
)(App);
