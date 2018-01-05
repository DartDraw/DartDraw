export function fileSave(root, action) {
	let stateString = JSON.stringify(root);
	const event = action.payload.data;
    event.sender.send('file-save', stateString);
}

// export function fileOpen() {
	
// }



// const initialState = {
//     shapes: {
//         byId: {},
//         allIds: []
//     },
//     selected: [],
//     boundingBoxes: {},
//     selectionBoxes: {},
//     marqueeBox: null,
//     lastSavedShapes: {},
//     editInProgress: false,
//     canvasHeight: 850,
//     canvasWidth: 1000,
//     canvasFill: 'white',
//     scale: 1,
//     panX: 0,
//     panY: 0,
//     past: [],
//     future: []
// };