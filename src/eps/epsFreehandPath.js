import { transformPoint } from '../reducers/utilities/matrix';

class epsFreehandPath {

	constructor(freehandPath) {
		this.freehandPath = freehandPath;
		this.produceEps = this.produceEps.bind(this);
		this.getCoords = this.getCoords.bind(this);
		this.getDrawing = this.getDrawing.bind(this);
	}

	produceEps(canvasHeightInPixels) {
		var drawing = this.getDrawing(canvasHeightInPixels);
		var pointsString = drawing.pointsString;
		var commandString = drawing.commandString;

		var strokeStr = this.freehandPath.stroke;
		var strokeRawRGB = strokeStr.substring(5, strokeStr.length-1);
		var strokeArray = strokeRawRGB.split(',');

		var strokeR = parseInt(strokeArray[0], 10)/255;
		var strokeG = parseInt(strokeArray[1], 10)/255;
		var strokeB = parseInt(strokeArray[2], 10)/255;

		var strokeWidth = this.freehandPath.strokeWidth;

		var drawingInfo = 
`newpath
${pointsString}
${commandString}
${strokeR} ${strokeG} ${strokeB} setrgbcolor
${strokeWidth} setlinewidth
stroke
`;

		return drawingInfo;

	}

	getCoords() {
		const coords = [];
		for (var i = 0; i < this.freehandPath.points.length; i = i + 2) {
			coords.push(transformPoint(this.freehandPath.points[i], this.freehandPath.points[i+1], this.freehandPath.transform[0].parameters));
		}
		return coords;
	}

	getDrawing(canvasHeightInPixels) {
		const coords = this.getCoords();

		if (!coords.hasOwnProperty(0)) {
			return "";
		}

		var pointsString = coords[0].x.toString() + " " + (canvasHeightInPixels - coords[0].y).toString();
		var commandString = "moveto";

		for (var i = 1; i < this.freehandPath.points.length/2; i = i + 1) {
		    let coord = coords[i];
			pointsString += " " + coord.x.toString() + " " + (canvasHeightInPixels - coord.y).toString();
			commandString += " lineto";
		}

		pointsString += " " + coords[0].x.toString() + " " + (canvasHeightInPixels - coords[0].y).toString();
		commandString += " lineto";
		return {
			pointsString: pointsString,
			commandString: commandString
		};
	}
}


export default epsFreehandPath;