import { connect } from 'react-redux';
import BottomScroll from './BottomScroll';
import { scroll } from './../../actions/canvas';

const mapStateToProps = ({ drawingState }) => {
    const { panX, panY, canvasWidth, ruler, scale } = drawingState;
    const maxPanX = canvasWidth - (window.innerWidth - ruler.width - 45) / scale;
    return {
        panX,
        maxPanX,
        panY,
        canvasWidth
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onScroll: () => {
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BottomScroll);
