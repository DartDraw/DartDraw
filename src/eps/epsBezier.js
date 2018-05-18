import { transformPoint } from '../reducers/utilities/matrix';

class epsBezier {

	constructor(bezier) {
		this.bezier = bezier;
		this.produceEps = this.produceEps.bind(this);
		this.getCoords = this.getCoords.bind(this);
		this.getDrawing = this.getDrawing.bind(this);
		this.getControlPoints = this.getControlPoints.bind(this);
		this.getParams = this.getParams.bind(this);
	}

	produceEps(canvasHeightInPixels) {
		var drawing = this.getDrawing(canvasHeightInPixels);
		var pointsString = drawing.pointsString;
		var commandString = drawing.commandString;

		var fillStr = this.bezier.fill;
		var fillRawRGB = fillStr.substring(5, fillStr.length-1);
		var fillArray = fillRawRGB.split(',');

		var fillR = parseInt(fillArray[0], 10)/255;
		var fillG = parseInt(fillArray[1], 10)/255;
		var fillB = parseInt(fillArray[2], 10)/255;

		var strokeStr = this.bezier.stroke;
		var strokeRawRGB = strokeStr.substring(5, strokeStr.length-1);
		var strokeArray = strokeRawRGB.split(',');

		var strokeR = parseInt(strokeArray[0], 10)/255;
		var strokeG = parseInt(strokeArray[1], 10)/255;
		var strokeB = parseInt(strokeArray[2], 10)/255;

		var strokeWidth = this.bezier.strokeWidth;

		var drawingInfo = 
`newpath
${pointsString}
closepath
${fillR} ${fillG} ${fillB} setrgbcolor
fill
newpath
${pointsString}
closepath
${strokeR} ${strokeG} ${strokeB} setrgbcolor
${strokeWidth} setlinewidth
stroke
`;

		return drawingInfo;

	}

	getCoords() {
		const coords = [];
		for (var i = 0; i < this.bezier.points.length; i = i + 2) {
			coords.push(transformPoint(this.bezier.points[i], this.bezier.points[i+1], this.bezier.transform[0].parameters));
		}
		return coords;
	}

	getControlPoints() {
		const controlPoints = [];
		for (var i = 1; i < this.bezier.points.length/2; i++) {
			controlPoints.push({0: transformPoint(this.bezier.controlPoints[i][0].x, this.bezier.controlPoints[i][0].y, this.bezier.transform[0].parameters), 1: transformPoint(this.bezier.controlPoints[i][1].x, this.bezier.controlPoints[i][1].y, this.bezier.transform[0].parameters)});
		}
		return controlPoints;
	}

	getDrawing(canvasHeightInPixels) {
		const coords = this.getCoords();
		const controlPoints = this.getControlPoints();
		console.log(controlPoints);

		if (!coords.hasOwnProperty(0)) {
			return "";
		}

		var pointsString = coords[0].x.toString() + " " + (canvasHeightInPixels - coords[0].y).toString();
		pointsString += " moveto";

		for (var i = 1; i < this.bezier.points.length/2; i = i + 1) {
		    let coord = coords[i];
		    let controlPointOne;
		    console.log(i-2);
		    console.log(i-1);
		    if (i-2 < 0) {
		    	let index = (controlPoints.length) - 1;
		    	console.log(index);
		    	controlPointOne = controlPoints[index];
		    } else {
		    	controlPointOne = controlPoints[i-2];
		    }
		    let controlPointTwo = controlPoints[i-1];
		    console.log(controlPointTwo);

		    pointsString += " " + controlPointOne[1].x.toString() + " " + (canvasHeightInPixels - controlPointOne[1].y).toString();
		    pointsString += " " + controlPointTwo[0].x.toString() + " " + (canvasHeightInPixels - controlPointTwo[0].y).toString();
			pointsString += " " + coord.x.toString() + " " + (canvasHeightInPixels - coord.y).toString();
			pointsString += " curveto";
		}

		return {
			pointsString: pointsString,
			commandString: ""
		};
	}

	getParams() {
		return {
			numPoints: (this.bezier.points.length)/2
		}
	}
}


export default epsBezier;