export const SELECT_TOOL = 'SELECT_TOOL';
export const UNDO_CLICK = 'UNDO_CLICK';
export const REDO_CLICK = 'REDO_CLICK';

export function selectTool(toolType) {
    return { type: SELECT_TOOL, payload: { toolType } };
}

export function undoClick() {
    return { type: UNDO_CLICK };
}

export function redoClick() {
    return { type: REDO_CLICK };
}
