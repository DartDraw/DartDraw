import { connect } from 'react-redux';
import BottomScroll from './BottomScroll';
import { scroll } from './../../actions/canvas';

const mapStateToProps = ({ drawingState, menuState }) => {
    const { panX, panY, canvasWidth, ruler, scale } = drawingState;
    const maxPanX = canvasWidth - (window.innerWidth - ruler.width - 45) / scale;
    return {
        panX,
        maxPanX,
        panY,
        canvasWidth,
        contextualMenuVisible: menuState.showContextualMenu
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onScroll: (deltaX, deltaY) => {
            dispatch(scroll(deltaX, deltaY));
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BottomScroll);