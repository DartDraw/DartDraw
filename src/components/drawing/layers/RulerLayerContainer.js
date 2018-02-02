import { connect } from 'react-redux';
import RulerLayer from './RulerLayer';
import { setRulerGrid } from './../../../actions/menu';

const mapStateToProps = ({ drawingState, menuState }) => {
    const { ruler, mouseCoords, canvasWidth, canvasHeight, scale } = drawingState;
    const { showRulers } = menuState;
    return {
        ruler: ruler,
        mouseCoords: mouseCoords,
        width: Math.min(canvasWidth * scale, window.innerWidth - ruler.width - 45),
        height: Math.min(canvasHeight * scale, window.innerHeight - ruler.width - 45),
        widthInUnits: canvasWidth / ruler.pixelsPerUnit,
        heightInUnits: canvasHeight / ruler.pixelsPerUnit,
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
