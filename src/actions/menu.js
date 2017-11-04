export const KEY_DOWN = 'KEY_DOWN';
export const KEY_UP = 'KEY_UP';
export const SELECT_TOOL = 'SELECT_TOOL';
export const EXPORT_CLICK = 'EXPORT_CLICK';
export const SELECT_COLOR = 'SELECT_COLOR';
export const SELECT_COLOR_PALETTE = 'SELECT_COLOR_PALETTE';
export const UNDO_CLICK = 'UNDO_CLICK';
export const REDO_CLICK = 'REDO_CLICK';
export const ZOOM_IN = 'ZOOM_IN';
export const ZOOM_OUT = 'ZOOM_OUT';
export const CUSTOM_ZOOM = 'CUSTOM_ZOOM';
export const GROUP_BUTTON_CLICK = 'GROUP_BUTTON_CLICK';
export const UNGROUP_BUTTON_CLICK = 'UNGROUP_BUTTON_CLICK';
export const MOVE_BACKWARD = 'MOVE_BACKWARD';
export const MOVE_FORWARD = 'MOVE_FORWARD';
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

export function exportClick() {
    return { type: EXPORT_CLICK };
}

export function selectColor(color) {
    return { type: SELECT_COLOR, payload: { color } };
}

export function selectColorPalette(colorPalette) {
    return { type: SELECT_COLOR_PALETTE, payload: { colorPalette } };
}

export function undoClick() {
    return { type: UNDO_CLICK };
}

export function redoClick() {
    return { type: REDO_CLICK };
}

export function zoomIn() {
    return { type: ZOOM_IN };
}

export function zoomOut() {
    return { type: ZOOM_OUT };
}

export function customZoom(customScale) {
    return { type: CUSTOM_ZOOM, payload: { customScale } };
}

export function groupButtonClick() {
    return { type: GROUP_BUTTON_CLICK };
}

export function ungroupButtonClick() {
    return { type: UNGROUP_BUTTON_CLICK };
}

export function moveBackward() {
    return { type: MOVE_BACKWARD };
}

export function moveForward() {
    return { type: MOVE_FORWARD };
}

export function sendToBack() {
    return { type: SEND_BACK };
}

export function bringToFront() {
    return { type: BRING_FRONT };
}
