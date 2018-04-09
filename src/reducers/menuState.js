import * as menuActions from '../actions/menu';
import * as menu from './caseFunctions/menu';
import * as grid from './caseFunctions/grid';
import * as rulers from './caseFunctions/rulers';
import { deepCopy } from './utilities/object';

const initialState = {
    color: {r: 33, g: 15, b: 243, a: 1},
    fillColor: {r: 33, g: 15, b: 243, a: 1},
    strokeColor: {r: 200, g: 0, b: 200, a: 1},
    toolType: '',
    fillStrokeButton: 'fill',
    currentKeys: {},
    copied: false,
    pasted: false,
    align: ['top', 'left'],
    centeredControl: false,
    rectangleRadius: {x: 50, y: 50},
    currentPalette: 'Default',
    colorType: 'RGB',
    palettes: {
        'Default': {
            colors: [{r: 255, g: 255, b: 255, a: 1}, {r: 244, g: 67, b: 54, a: 1}, {r: 233, g: 30, b: 99, a: 1},
                {r: 103, g: 58, b: 183, a: 1}, {r: 33, g: 150, b: 243, a: 1}, {r: 76, g: 175, b: 80, a: 1},
                {r: 255, g: 235, b: 59, a: 1}, {r: 255, g: 152, b: 0, a: 1}, {r: 121, g: 85, b: 72, a: 1},
                {r: 0, g: 0, b: 0, a: 1}]
        },
        'Primary': {
            colors: [{r: 255, g: 0, b: 0, a: 1}, {r: 0, g: 0, b: 255, a: 1}, {r: 255, g: 255, b: 0, a: 1}]
        },
        'Grid': { // {r: , g: , b: , a:1}
            colors: [{r: 0, g: 0, b: 0, a: 1}, {r: 51, g: 51, b: 51, a: 1}, {r: 102, g: 102, b: 102, a: 1}, {r: 140, g: 140, b: 140, a: 1}, {r: 179, g: 179, b: 179, a: 1}, {r: 204, g: 204, b: 204, a: 1}, {r: 255, g: 255, b: 255, a: 1}]
        }
    },
    gridSnapping: false,
    showRulers: true,
    showSubDivisions: true,
    showGrid: true,
    showContextualMenu: true,
    showSettingsModal: false,
    colorPickerType: 'gradient'
};

function menuState(state = initialState, action, root) {
    const stateCopy = deepCopy(state);

    switch (action.type) {
        case menuActions.KEY_DOWN:
            return menu.keyDown(stateCopy, action, root);
        case menuActions.KEY_UP:
            return menu.keyUp(stateCopy, action, root);
        case menuActions.SELECT_TOOL:
            return menu.selectTool(stateCopy, action, root);
        case menuActions.SELECT_BUTTON:
            return menu.selectButton(stateCopy, action, root);
        case menuActions.SELECT_COLOR:
            return menu.selectColor(stateCopy, action, root);
        case menuActions.ALIGNMENT_CHANGE:
            return menu.selectAlignment(stateCopy, action, root);
        case menuActions.TOGGLE_GRID_SNAPPING:
            return grid.toggleGridSnapping(stateCopy, action, root);
        case menuActions.UPDATE_OPACITY:
            return menu.updateOpacity(stateCopy, action);
        case menuActions.ADD_COLOR:
            return menu.addColor(stateCopy, action);
        case menuActions.COLOR_UPDATE:
            return menu.colorUpdate(stateCopy, action);
        case menuActions.SELECT_PALETTE:
            return menu.selectPalette(stateCopy, action);
        case menuActions.CHANGE_COLOR_TYPE:
            return menu.changeColorType(stateCopy, action);
        case menuActions.ADD_PALETTE:
            return menu.addPalette(stateCopy, action);
        case menuActions.REMOVE_PALETTE:
            return menu.removePalette(stateCopy, action);
        case menuActions.REMOVE_COLOR:
            return menu.removeColor(stateCopy, action);
        case menuActions.SET_PICKER_TYPE:
            return menu.setPickerType(stateCopy, action);

        case menuActions.TOGGLE_SHOW_GRID:
            return grid.toggleShowGrid(stateCopy, action, root);
        case menuActions.TOGGLE_SHOW_SUBDIVISIONS:
            return grid.toggleShowSubDivisions(stateCopy, action, root);
        case menuActions.TOGGLE_SHOW_RULER:
            return rulers.toggleShowRulers(stateCopy, action, root);
        case menuActions.TOGGLE_CONTEXTUAL_MENU:
            stateCopy.showContextualMenu = !stateCopy.showContextualMenu;
            return stateCopy;
        case menuActions.TOGGLE_SETTINGS_MODAL:
            stateCopy.showSettingsModal = !stateCopy.showSettingsModal;
            return stateCopy;

        default:
            return stateCopy;
    }
}

export default menuState;
