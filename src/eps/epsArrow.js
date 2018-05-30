import { transformPoint } from '../reducers/utilities/matrix';
var math = window.require('mathjs');
math.config({
  number: 'BigNumber', // Default type of number:
                       // 'number' (default), 'BigNumber', or 'Fraction'
  precision: 64        // Number of significant digits for BigNumbers
});

class epsArrow {

	constructor(arrow, head, linePoints) {
		console.log("logging arrow");
		console.log(arrow);
		this.arrow = arrow;
		this.head = head;
		this.linePoints = linePoints;
		this.produceEps = this.produceEps.bind(this);
		this.getCoords = this.getCoords.bind(this);
		this.getDrawing = this.getDrawing.bind(this);
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

		return drawingInfo;
	}

	getCoords() {
		const coords = [];
		var anchor = (this.head) ? {x: this.linePoints[2], y: this.linePoints[3]} : {x: this.linePoints[0], y: this.linePoints[1]}
		coords.push(anchor);

		var lineXDimension = math.subtract(math.bignumber(this.linePoints[2]),math.bignumber(this.linePoints[0]));
		var lineLength = math.sqrt(math.add(math.pow(math.subtract(math.bignumber(this.linePoints[2]), math.bignumber(this.linePoints[0])),math.bignumber(2)),math.pow(math.subtract(math.bignumber(this.linePoints[3]), math.bignumber(this.linePoints[1])),math.bignumber(2))));
		var cosAngle = math.divide(lineXDimension,lineLength);
		var lineAngle = math.acos(cosAngle);
		if (math.smaller(math.subtract(math.bignumber(this.linePoints[3]),math.bignumber(this.linePoints[1])),math.bignumber(0))) {
			lineAngle = math.multiply(math.bignumber(-1),lineAngle);
		}
		console.log(math.number(lineAngle));

		let arrowLength, arrowHeight;

		switch(this.arrow.type) {
			case "triangle":
				arrowLength = math.subtract(math.bignumber(this.arrow.points[2]),math.bignumber(this.arrow.points[0]));
				arrowHeight = math.subtract(math.bignumber(this.arrow.points[5]),math.bignumber(this.arrow.points[1]));

				let arrowBaseX = math.subtract(math.bignumber(coords[0].x), math.multiply(arrowLength,math.cos(lineAngle)));
				let arrowBaseY = math.subtract(math.bignumber(coords[0].y), math.multiply(arrowLength,math.sin(lineAngle)));

				console.log("logging the end of line point, then the arrow base coordinates");
				console.log(coords[0]);
				console.log(math.number(arrowBaseX));
				console.log(math.number(arrowBaseY));

				let xDiff = math.multiply(math.divide(arrowHeight,math.bignumber(2)),math.cos(math.subtract(math.divide(math.pi,math.bignumber(2)),lineAngle)));
				let yDiff = math.multiply(math.divide(arrowHeight,math.bignumber(2)),math.sin(math.subtract(math.divide(math.pi,math.bignumber(2)),lineAngle)));

				console.log("logging xDiff and yDiff");
				console.log(math.number(xDiff));
				console.log(math.number(yDiff));

				coords.push({x: math.number(math.add(arrowBaseX,xDiff)),y: math.number(math.subtract(arrowBaseY,yDiff))});
				coords.push({x: math.number(math.subtract(arrowBaseX,xDiff)),y: math.number(math.add(arrowBaseY,yDiff))});

				return coords;
			// case "barbed":
			// 	return coords;
			default:
				return this.arrow.points;
		}
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