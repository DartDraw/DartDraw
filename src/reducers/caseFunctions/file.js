export function fileSave(root, action) {
    let stateString = JSON.stringify(root.drawingState);
    const event = action.payload.data;
    event.sender.send('file-save', stateString);
}

export function fileOpen(stateCopy, action) {
    var newDrawingState = JSON.parse(action.payload.data);

    stateCopy.shapes.byId = newDrawingState.shapes.byId;
    stateCopy.shapes.allIds = newDrawingState.shapes.allIds;
    stateCopy.canvasFill = newDrawingState.canvasFill;
    stateCopy.canvasHeightInUnits = newDrawingState.canvasHeightInUnits;
    stateCopy.canvasWidthInUnits = newDrawingState.canvasWidthInUnits;
    stateCopy.canvasHeightInPixels = newDrawingState.canvasHeightInPixels;
    stateCopy.canvasWidthInPixels = newDrawingState.canvasWidthInPixels;
    stateCopy.pixelsPerUnit = newDrawingState.pixelsPerUnit;
    stateCopy.scale = newDrawingState.scale;
    stateCopy.pasteOffset = newDrawingState.pasteOffset;
    stateCopy.duplicateOffset = newDrawingState.duplicateOffset;
    stateCopy.gridSnapping = newDrawingState.gridSnapping;
    stateCopy.gridPreferences = newDrawingState.gridPreferences;
    stateCopy.gridLines = newDrawingState.gridLines;
    stateCopy.rulerPreferences = newDrawingState.rulerPreferences;
    stateCopy.ruler = newDrawingState.ruler;

    return stateCopy;
}
