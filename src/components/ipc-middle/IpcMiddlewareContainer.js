import { connect } from 'react-redux';
import { fileSave, fileOpen } from './../../actions/menu';
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
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(IpcMiddleware);
