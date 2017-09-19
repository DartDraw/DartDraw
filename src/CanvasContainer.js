import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import Canvas from './Canvas';
import * as actions from './actions';

const mapStateToProps = (state) => {
  const zIndexedShapeIds = state.zIndexedShapeIds.map(function(id) {
    return state.drawing[id]
  });

  return {
        zIndexedShapeIds: zIndexedShapeIds
    };
};

const mapDispatchToProps = (dispatch) => {
    return { actions: bindActionCreators(actions, dispatch) };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Canvas);
