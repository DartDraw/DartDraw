import { connect } from 'react-redux';
import { fileSave, fileOpen } from './../../actions/menu';
import { canvasColorChange } from './../../actions/canvas';
import IpcMiddleware from './IpcMiddleware';

const mapStateToProps = (props) => {
    return props;
};

const mapDispatchToProps = (dispatch) => {
    return {
        onFileSave: (data) => {
            dispatch(fileSave(data));
        },
        onFileOpen: (data) => {
            dispatch(fileOpen(data));
        },
        onCanvasColorChange: (color) => {
            dispatch(canvasColorChange(color));
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(IpcMiddleware);
