import { connect } from 'react-redux';
import BackgroundLayer from './BackgroundLayer';

// console.log(window.require('electron').menu[3]);
window.require('electron').remote.globalShortcut.register('CommandOrControl+Y', () => {
    // Do stuff when Y and either Command/Control is pressed.
    console.log("pressed y");
});

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
    const { canvasWidth, canvasHeight } = drawingState;
    return {
        width: canvasWidth,
        height: canvasHeight,
        fill: 'white'
    };
};

export default connect(
    mapStateToProps
)(BackgroundLayer);
