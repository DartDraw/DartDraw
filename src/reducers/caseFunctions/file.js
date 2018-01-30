export function fileSave(root, action) {
	let stateString = JSON.stringify(root);
	const event = action.payload.data;
    event.sender.send('file-save', stateString);
}

export function fileOpen(stateCopy, action) {
    var newShapes = JSON.parse(action.payload.data);
    // var newDrawingState = newState.drawingState;
    stateCopy.shapes.byId = newShapes.byId;
    stateCopy.shapes.allIds = newShapes.allIds;
    // stateCopy.selected = newDrawingState.selected;
    // stateCopy.boundingBoxes = newDrawingState.boundingBoxes;
    // stateCopy.selectionBoxes = newDrawingState.selectionBoxes;
    // stateCopy.marqueeBox = newDrawingState.marqueeBox;
    // stateCopy.lastSavedShapes = newDrawingState.lastSavedShapes;
    // stateCopy.editInProgress = newDrawingState.editInProgress;
    // stateCopy.canvasHeight = newDrawingState.canvasHeight;
    // stateCopy.canvasWidth = newDrawingState.canvasWidth;
    // stateCopy.canvasFill = newDrawingState.canvasFill;
    // stateCopy.scale = newDrawingState.scale;
    // stateCopy.panX = newDrawingState.panX;
    // stateCopy.panY = newDrawingState.panY;
    // stateCopy.past = newDrawingState.past;
    // stateCopy.future = newDrawingState.future;

    return stateCopy;
}

const initialState = {
    shapes: {
        byId: {},
        allIds: []
    },
    selected: [],
    boundingBoxes: {},
    selectionBoxes: {},
    marqueeBox: null,
    lastSavedShapes: {},
    editInProgress: false,
    canvasHeight: 850,
    canvasWidth: 1000,
    canvasFill: 'white',
    scale: 1,
    panX: 0,
    panY: 0,
    past: [],
    future: []
};