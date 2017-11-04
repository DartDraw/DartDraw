import * as menuActions from '../actions/menu';
import * as menu from './caseFunctions/menu';
import { deepCopy } from './utilities/object';

const initialState = {
    toolType: '',
    currentKeys: {},
    color: { r: 33, g: 150, b: 243, a: 1 },
    currentPalette: 0,
    colorPalettes: [
        {
            'name': 'Default',
            'type': 'HEX', // HEX, RGB, CMYK
            'colors': ["rgba(255,255,255,1)", "rgba(244,67,54,1)", "rgba(233,30,99,1)", "rgba(156,39,176,1)", "rgba(103,58,183,1)", "rgba(63,81,181,1)", "rgba(33,150,243,1)", "rgba(3,169,244,1)", "rgba(0,188,212,1)", "rgba(0,150,136,1)", "rgba(76,175,80,1)", "rgba(139,195,74,1)", "rgba(205,220,57,1)", "rgba(255,235,59,1)", "rgba(255,193,7,1)", "rgba(255,152,0,1)", "rgba(255,87,34,1)", "rgba(121,85,72,1)"]
        }
    ]
};

// 'colors': ["#ffffff", "#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#2196f3", "#03a9f4", "#00bcd4", "#009688", "#4caf50", "#8bc34a", "#cddc39", "#ffeb3b", "#ffc107", "#ff9800", "#ff5722", "#795548"]

function menuState(state = initialState, action, root) {
    const stateCopy = deepCopy(state);

    switch (action.type) {
        case menuActions.KEY_DOWN:
            return menu.keyDown(stateCopy, action, root);
        case menuActions.KEY_UP:
            return menu.keyUp(stateCopy, action, root);
        case menuActions.SELECT_TOOL:
            return menu.selectTool(stateCopy, action, root);
        case menuActions.SELECT_COLOR:
            return menu.selectColor(stateCopy, action, root);
        case menuActions.SELECT_COLOR_PALETTE:
            return menu.selectColorPalette(stateCopy, action, root);
        default:
            return stateCopy;
    }
}

export default menuState;
