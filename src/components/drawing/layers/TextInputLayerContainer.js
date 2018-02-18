import { connect } from 'react-redux';
import TextInputLayer from './TextInputLayer';
import {
    shapeClick,
    textInputChange
} from '../../../actions/canvas';

const mapStateToProps = ({ drawingState }, ownProps) => {
    const { shapes, selected, canvasHeight, canvasWidth, scale } = drawingState;
    const { propagateEvents } = ownProps;
    const shapesArray = shapes.allIds.filter(id => {
        return shapes.byId[id].type === 'text' && selected.indexOf(id) > -1;
    }).map(id => {
        return shapes.byId[id];
    });

    return {
        textObjects: shapesArray,
        canvasHeight: canvasHeight * scale,
        canvasWidth: canvasWidth * scale,
        propagateEvents
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onShapeClick: (shapeId, event) => {
            dispatch(shapeClick(shapeId));
        },
        onTextInputChange: (textId, value, focused, selectionRange) => {
            dispatch(textInputChange(textId, value, focused, selectionRange));
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TextInputLayer);
