import { connect } from 'react-redux';
import RulerLayer from './RulerLayer';
import { setRulerGrid } from './../../../actions/menu';
import { MENU_WIDTH } from '../../../constants';

const mapStateToProps = ({ drawingState, menuState }) => {
    const { ruler, mouseCoords, canvasWidth, canvasHeight, scale } = drawingState;
    const { showRulers } = menuState;
    return {
        ruler: ruler,
        width: Math.min(canvasWidth * scale, window.innerWidth - ruler.width - MENU_WIDTH),
        height: Math.min(canvasHeight * scale, window.innerHeight - ruler.width - MENU_WIDTH),
        widthInUnits: canvasWidth / ruler.pixelsPerUnit,
        heightInUnits: canvasHeight / ruler.pixelsPerUnit,
        mouseCoords: mouseCoords,
        showRulers: showRulers
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        onSetRulerGrid: (canvasSpecs) => {
            dispatch(setRulerGrid(canvasSpecs));
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RulerLayer);
