export const KEY_DOWN = 'KEY_DOWN';
export const KEY_UP = 'KEY_UP';
export const SELECT_TOOL = 'SELECT_TOOL';
export const SELECT_COLOR = 'SELECT_COLOR';
export const UNDO_CLICK = 'UNDO_CLICK';
export const REDO_CLICK = 'REDO_CLICK';
export const GROUP_CLICK = 'GROUP_CLICK';
export const SEND_BACK = 'SEND_BACK';
export const BRING_FRONT = 'BRING_FRONT';

export function keyDown(keyCode) {
    return { type: KEY_DOWN, payload: { keyCode } };
}

export function keyUp(keyCode) {
    return { type: KEY_UP, payload: { keyCode } };
}

export function selectTool(toolType) {
    return { type: SELECT_TOOL, payload: { toolType } };
}

export function selectColor(color) {
    return { type: SELECT_COLOR, payload: { color } };
}

export function undoClick() {
    return { type: UNDO_CLICK };
}

export function redoClick() {
    return { type: REDO_CLICK };
}

export function groupClick() {
    return { type: GROUP_CLICK };
}

export function sendToBack() {
    return { type: SEND_BACK };
}

export function bringToFront() {
    return { type: BRING_FRONT };
}
