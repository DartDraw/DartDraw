import { connect } from 'react-redux';
import RightScroll from './RightScroll';
import { scroll } from './../../actions/canvas';
import { MENU_WIDTH } from '../../constants';

const mapStateToProps = ({ drawingState, menuState }) => {
    const { panX, panY, canvasHeight, ruler, scale } = drawingState;
    const maxPanY = canvasHeight - (window.innerHeight - ruler.width - MENU_WIDTH) / scale;
    return {
        panX,
        panY,
        maxPanY,
        canvasHeight,
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
)(RightScroll);
