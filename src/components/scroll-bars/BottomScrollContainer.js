import { connect } from 'react-redux';
import BottomScroll from './BottomScroll';
import { scroll } from './../../actions/canvas';
import { MENU_WIDTH } from '../../constants';

const mapStateToProps = ({ drawingState, menuState }) => {
    const { panX, panY, canvasWidth, ruler, scale } = drawingState;
    const maxPanX = canvasWidth - (window.innerWidth - ruler.width - MENU_WIDTH) / scale;
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
