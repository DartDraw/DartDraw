import * as menuActions from '../actions/menu';
import * as menu from './caseFunctions/menu';
import * as color from './caseFunctions/color';
import * as grid from './caseFunctions/grid';
import * as rulers from './caseFunctions/rulers';
import { deepCopy } from './utilities/object';
import { defaultFill, defaultStroke } from '../constants';
import { PRIMARY, DEFAULT, TEST } from '../defaultPalettes';

const initialState = {
    color: {
        type: 'RGB',
        rgba: {r: 10, g: 10, b: 100, a: defaultFill.alpha},
        value: [defaultFill.value[0], defaultFill.value[1], defaultFill.value[2]],
        alpha: defaultFill.alpha
    },
    fillColor: {
        type: 'RGB',
        rgba: {r: defaultFill.value[0], g: defaultFill.value[1], b: defaultFill.value[2], a: defaultFill.alpha},
        value: [defaultFill.value[0], defaultFill.value[1], defaultFill.value[2]],
        alpha: defaultFill.alpha
    },
    strokeColor: {
        type: 'RGB',
        rgba: {r: defaultStroke.value[0], g: defaultStroke.value[1], b: defaultStroke.value[2], a: defaultStroke.alpha},
        value: [defaultStroke.value[0], defaultStroke.value[1], defaultStroke.value[2]],
        alpha: defaultStroke.alpha
    },
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
    docColorMode: 'RGB',
    palettes: {
        'Default': {
            colors: DEFAULT
        },
        'Primary': {
            colors: PRIMARY
        },
        'Test': {
            colors: TEST
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
        case menuActions.SELECT_PALETTE:
            return menu.selectPalette(stateCopy, action);
        case menuActions.CHANGE_COLOR_TYPE:
            return menu.changeColorType(stateCopy, action);
        case menuActions.CHANGE_COLOR_MODE:
            return menu.changeColorMode(stateCopy, action);
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
