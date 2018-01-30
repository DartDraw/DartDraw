import { transformPoint } from '../reducers/utilities/matrix';

class epsPolygon {

	constructor(polygon) {
		this.polygon = polygon;
		this.produceEps = this.produceEps.bind(this);
		this.getCoords = this.getCoords.bind(this);
		this.getDrawing = this.getDrawing.bind(this);
	}

	produceEps(canvasHeightInPixels) {
		var drawing = this.getDrawing(canvasHeightInPixels);
		var pointsString = drawing.pointsString;
		var commandString = drawing.commandString;

		var fillStr = this.polygon.fill;
		var fillRawRGB = fillStr.substring(5, fillStr.length-1);
		var fillArray = fillRawRGB.split(',');

		var fillR = parseInt(fillArray[0], 10)/255;
		var fillG = parseInt(fillArray[1], 10)/255;
		var fillB = parseInt(fillArray[2], 10)/255;

		var strokeStr = this.polygon.stroke;
		var strokeRawRGB = strokeStr.substring(5, strokeStr.length-1);
		var strokeArray = strokeRawRGB.split(',');

		var strokeR = parseInt(strokeArray[0], 10)/255;
		var strokeG = parseInt(strokeArray[1], 10)/255;
		var strokeB = parseInt(strokeArray[2], 10)/255;

		var strokeWidth = this.polygon.strokeWidth;

		var drawingInfo = 
`newpath
${pointsString}
${commandString}
closepath
${strokeR} ${strokeG} ${strokeB} setrgbcolor
${strokeWidth} setlinewidth
stroke
newpath
${pointsString}
${commandString}
closepath
${fillR} ${fillG} ${fillB} setrgbcolor
fill
`;

		return drawingInfo;

	}

	getCoords() {
		const coords = {};
		for (var i = 0; i < this.polygon.points.length; i = i + 2) {
			coords[i/2] = transformPoint(this.polygon.points[i], this.polygon.points[i+1], this.polygon.transform[0].parameters);
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

		for (var i = 1; i < this.polygon.points.length/2; i = i + 1) {
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


export default epsPolygon;