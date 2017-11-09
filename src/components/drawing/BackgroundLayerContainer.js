import { connect } from 'react-redux';
import BackgroundLayer from './BackgroundLayer';
import { canvasColorChange } from './../../actions/canvas';

// const {remote} = window.require('electron');
// const {MenuItem} = remote;

// const menu = window.require('electron').remote.Menu.getApplicationMenu();
//
// menu.insert(1, new MenuItem({label: 'MenuItem1', click() { console.log('item 1 clicked'); }}));
// menu.append(new MenuItem({type: 'separator'}));
// menu.append(new MenuItem({label: 'MenuItem2', type: 'checkbox', checked: true}));
// let backgroundColor = '#ffffff';

// const currentmenu = window.require('electron').remote.menu.items;
// console.log(currentmenu);
// const menu = window.getApplicationMenu();
// console.log(menu);
// const backgroundColor = '#ffffff';

const mapStateToProps = ({ drawingState }) => {
    const { canvasWidth, canvasHeight, canvasFill } = drawingState;
    return {
        width: canvasWidth,
        height: canvasHeight,
        fill: canvasFill
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onCanvasColorChange: (color) => {
            dispatch(canvasColorChange(color));
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BackgroundLayer);
