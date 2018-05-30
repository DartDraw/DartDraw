import { transformPoint } from '../reducers/utilities/matrix';
var math = window.require('mathjs');
math.config({
  number: 'BigNumber', // Default type of number:
                       // 'number' (default), 'BigNumber', or 'Fraction'
  precision: 64        // Number of significant digits for BigNumbers
});

class epsArrow {

	constructor(arrow, head, linePoints) {
		this.arrow = arrow;
		this.head = head;
		this.linePoints = linePoints;
		this.produceEps = this.produceEps.bind(this);
		this.getCoords = this.getCoords.bind(this);
		this.getDrawing = this.getDrawing.bind(this);
		this.type = "arrow";
	}

	produceEps(canvasHeightInPixels) {
		var drawing = this.getDrawing(canvasHeightInPixels);
		var pointsString = drawing.pointsString;
		var commandString = drawing.commandString;

		var strokeStr = this.arrow.stroke;
		var strokeRawRGB = strokeStr.substring(5, strokeStr.length-1);
		var strokeArray = strokeRawRGB.split(',');

		var strokeR = parseInt(strokeArray[0], 10)/255;
		var strokeG = parseInt(strokeArray[1], 10)/255;
		var strokeB = parseInt(strokeArray[2], 10)/255;


		var drawingInfo = 
`newpath
${pointsString}
${commandString}
closepath
${strokeR} ${strokeG} ${strokeB} setrgbcolor
fill
`;

		const coords = this.getCoords();
		console.log("logging arrowhead coords");
		console.log(coords);
		var endX, endY;

		if (this.head) {
			if (this.arrow.type === "barbed") {
				if (this.arrow.flip) {
					endX = coords[0].x;
					endY = coords[0].y;
				} else {
					endX = coords[2].x;
					endY = coords[2].y;
				}
			} else {
				if (this.arrow.flip) {
					endX = coords[0].x;
					endY = coords[0].y;
				} else {
					endX = coords[1].x - (coords[1].x - coords[2].x)/2;
					endY = coords[1].y - (coords[1].y - coords[2].y)/2;
				}
			}
		} else {
			if (this.arrow.type === "barbed") {
				if (this.arrow.flip) {
					endX = coords[2].x;
					endY = coords[2].y;
				} else {
					endX = coords[0].x;
					endY = coords[0].y;
				}
			} else {
				if (this.arrow.flip) {
					endX = coords[1].x - (coords[1].x - coords[2].x)/2;
					endY = coords[1].y - (coords[1].y - coords[2].y)/2;
				} else {
					endX = coords[0].x;
					endY = coords[0].y;
				}
			}
		}

		return {
			drawing: drawingInfo,
			endPoint: {x: endX, y: endY}
		};
	}

	getCoords() {
		const coords = [];
		var anchor, lineXDimension, lineLength, cosAngle, lineAngle;
		let arrowLength, arrowHeight, arrowBaseX, arrowBaseY, tempX, tempY;

		if (this.head) {
			anchor = {x: math.bignumber(this.linePoints[2]), y: math.bignumber(this.linePoints[3])};
			lineXDimension = math.subtract(math.bignumber(this.linePoints[2]),math.bignumber(this.linePoints[0]));
			lineLength = math.sqrt(math.add(math.pow(math.subtract(math.bignumber(this.linePoints[2]), math.bignumber(this.linePoints[0])),math.bignumber(2)),math.pow(math.subtract(math.bignumber(this.linePoints[3]), math.bignumber(this.linePoints[1])),math.bignumber(2))));
			cosAngle = math.divide(lineXDimension,lineLength);
			lineAngle = math.acos(cosAngle);

			if (math.smaller(math.subtract(math.bignumber(this.linePoints[3]),math.bignumber(this.linePoints[1])),math.bignumber(0))) {
				lineAngle = math.multiply(math.bignumber(-1),lineAngle);
			}
	
			arrowLength = math.subtract(math.bignumber(this.arrow.points[2]),math.bignumber(this.arrow.points[0]));
			arrowHeight = math.subtract(math.bignumber(this.arrow.points[5]),math.bignumber(this.arrow.points[1]));
			arrowBaseX = math.subtract(math.bignumber(anchor.x), math.multiply(arrowLength,math.cos(lineAngle)));
			arrowBaseY = math.subtract(math.bignumber(anchor.y), math.multiply(arrowLength,math.sin(lineAngle)));

			if (this.arrow.flip) {
				lineAngle = math.subtract(lineAngle,math.pi);
				tempX = arrowBaseX;
				tempY = arrowBaseY;
				arrowBaseX = anchor.x;
				arrowBaseY = anchor.y;
				anchor.x = tempX;
				anchor.y = tempY;
			}

		} else {
			arrowBaseX = math.bignumber(this.linePoints[0]);
			arrowBaseY = math.bignumber(this.linePoints[1]);

			lineXDimension = math.subtract(math.bignumber(this.linePoints[2]),math.bignumber(this.linePoints[0]));
			lineLength = math.sqrt(math.add(math.pow(math.subtract(math.bignumber(this.linePoints[2]), math.bignumber(this.linePoints[0])),math.bignumber(2)),math.pow(math.subtract(math.bignumber(this.linePoints[3]), math.bignumber(this.linePoints[1])),math.bignumber(2))));
			cosAngle = math.divide(lineXDimension,lineLength);
			lineAngle = math.acos(cosAngle);

			if (math.smaller(math.subtract(math.bignumber(this.linePoints[3]),math.bignumber(this.linePoints[1])),math.bignumber(0))) {
				lineAngle = math.multiply(math.bignumber(-1),lineAngle);
			}

			arrowLength = math.subtract(math.bignumber(this.arrow.points[2]),math.bignumber(this.arrow.points[0]));
			arrowHeight = math.subtract(math.bignumber(this.arrow.points[5]),math.bignumber(this.arrow.points[1]));
			anchor = {};
			anchor.x = math.add(math.bignumber(arrowBaseX), math.multiply(arrowLength,math.cos(lineAngle)));
			anchor.y = math.add(math.bignumber(arrowBaseY), math.multiply(arrowLength,math.sin(lineAngle)));

			if (this.arrow.flip) {
				lineAngle = math.subtract(lineAngle,math.pi);
				tempX = arrowBaseX;
				tempY = arrowBaseY;
				arrowBaseX = anchor.x;
				arrowBaseY = anchor.y;
				anchor.x = tempX;
				anchor.y = tempY;
			}
		}

		coords.push({x: math.number(anchor.x), y: math.number(anchor.y)});

		let xDiff = math.multiply(math.divide(arrowHeight,math.bignumber(2)),math.cos(math.subtract(math.divide(math.pi,math.bignumber(2)),lineAngle)));
		let yDiff = math.multiply(math.divide(arrowHeight,math.bignumber(2)),math.sin(math.subtract(math.divide(math.pi,math.bignumber(2)),lineAngle)));

		let testCoord = {}
		testCoord.x = math.number(math.add(arrowBaseX,xDiff));
		testCoord.y = math.number(math.subtract(arrowBaseY,yDiff));
		coords.push(testCoord);

		if (this.arrow.type === "barbed") {
			let arrowMinorLength = math.subtract(math.bignumber(this.arrow.points[2]),math.bignumber(this.arrow.points[6]));
			let controlPointX = math.subtract(math.bignumber(coords[0].x), math.multiply(arrowMinorLength,math.cos(lineAngle)));
			let controlPointY = math.subtract(math.bignumber(coords[0].y), math.multiply(arrowMinorLength,math.sin(lineAngle)));
			coords.push({x: math.number(controlPointX), y: math.number(controlPointY)});
		}
		coords.push({x: math.number(math.subtract(arrowBaseX,xDiff)),y: math.number(math.add(arrowBaseY,yDiff))});

		return coords;
	}

	getDrawing(canvasHeightInPixels) {
		const coords = this.getCoords();

		if (!coords.hasOwnProperty(0)) {
			return "";
		}

		var pointsString = coords[0].x.toString() + " " + (canvasHeightInPixels - coords[0].y).toString();
		var commandString = "moveto";

		for (var i = 1; i < this.arrow.points.length/2; i = i + 1) {
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


export default epsArrow;