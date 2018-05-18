import { transformPoint } from '../reducers/utilities/matrix';
import epsEllipse from './epsEllipse';
import epsRectangle from "./epsRectangle";

class epsRoundedRectangle {

	constructor(roundedRectangle) {
		this.roundedRectangle = roundedRectangle;
		this.produceEps = this.produceEps.bind(this);
		this.getCoords = this.getCoords.bind(this);
		this.getLeftRectangle = this.getLeftRectangle.bind(this);
		this.getRightRectangle = this.getRightRectangle.bind(this);
		this.getCenterRectangle = this.getCenterRectangle.bind(this);
		this.getEllipses = this.getEllipses.bind(this);
	}

	produceEps(canvasHeightInPixels) {
		var leftRectangle = this.getLeftRectangle(canvasHeightInPixels);
		var rightRectangle = this.getRightRectangle(canvasHeightInPixels);
		var centerRectangle = this.getCenterRectangle(canvasHeightInPixels);

		var ellipsesEps = this.getEllipses(canvasHeightInPixels);

		var drawingInfo = 
`${leftRectangle}
${rightRectangle}
${centerRectangle}
${ellipsesEps[0]}
${ellipsesEps[1]}
${ellipsesEps[2]}
${ellipsesEps[3]}
`;

		return drawingInfo;

	}

	getCoords() {
		const coords = [];
		coords.push(transformPoint(this.roundedRectangle.x + this.roundedRectangle.rx, this.roundedRectangle.y + this.roundedRectangle.ry, this.roundedRectangle.transform[0].parameters));
		coords.push(transformPoint(this.roundedRectangle.x + this.roundedRectangle.width - this.roundedRectangle.rx, this.roundedRectangle.y + this.roundedRectangle.ry, this.roundedRectangle.transform[0].parameters));
		coords.push(transformPoint(this.roundedRectangle.x + this.roundedRectangle.width - this.roundecRectangle.rx, this.roundedRectangle.y + this.roundedRectangle.height - this.roundedRectangle.ry, this.roundedRectangle.transform[0].parameters));
		coords.push(transformPoint(this.roundedRectangle.x + this.roundedRectangle.rx, this.roundedRectangle.y + this.roundedRectangle.height - this.roundedRectangle.ry, this.roundedRectangle.transform[0].parameters));
		return coords;
	}

	getLeftRectangle(canvasHeightInPixels) {
		if (this.roundedRectangle.height <= (2 * this.roundedRectangle.ry))  {
			console.log("logging cause it's less than height");
			return "\n";
		}
		var leftRectangle = new epsRectangle({x: this.roundedRectangle.x, y: this.roundedRectangle.y + this.roundedRectangle.ry, width: this.roundedRectangle.rx, height: this.roundedRectangle.height - (2*this.roundedRectangle.ry), fill:this.roundedRectangle.fill, stroke: this.roundedRectangle.stroke, strokeWidth: this.roundedRectangle.strokeWidth, transform: this.roundedRectangle.transform});
		return leftRectangle.produceEps(canvasHeightInPixels);
	}

	getRightRectangle(canvasHeightInPixels) {
		if (this.roundedRectangle.height <= (2 * this.roundedRectangle.ry))  {
			console.log("logging cause it's less than height");
			return "\n";
		}
		var rightRectangle = new epsRectangle({x: this.roundedRectangle.x + this.roundedRectangle.width - this.roundedRectangle.rx, y: this.roundedRectangle.y + this.roundedRectangle.ry, width: this.roundedRectangle.rx, height: this.roundedRectangle.height - (2*this.roundedRectangle.ry), fill:this.roundedRectangle.fill, stroke: this.roundedRectangle.stroke, strokeWidth: this.roundedRectangle.strokeWidth, transform: this.roundedRectangle.transform});
		return rightRectangle.produceEps(canvasHeightInPixels);
	}

	getCenterRectangle(canvasHeightInPixels) {
		if (this.roundedRectangle.width <= (2 * this.roundedRectangle.rx))  {
			console.log("logging cause it's less than width");
			return "\n";
		}
		console.log("made it to producing a center rectangle but i shouldn't have");
		var centerRectangle = new epsRectangle({x: this.roundedRectangle.x + this.roundedRectangle.rx, y: this.roundedRectangle.y, width: this.roundedRectangle.rx - (2*this.roundedRectangle.rx), height: this.roundedRectangle.height, fill:this.roundedRectangle.fill, stroke: this.roundedRectangle.stroke, strokeWidth: this.roundedRectangle.strokeWidth, transform: this.roundedRectangle.transform});
		return centerRectangle.produceEps(canvasHeightInPixels);
	}

	getOriginalRectangle(canvasHeightInPixels) {
		var originalRectangle = new epsRectangle({x: this.roundedRectangle.x + this.roundedRectangle.rx, y: this.roundedRectangle.y, width: this.roundedRectangle.rx - (2*this.roundedRectangle.rx), height: this.roundedRectangle.height, fill:this.roundedRectangle.fill, stroke: this.roundedRectangle.stroke, strokeWidth: this.roundedRectangle.strokeWidth, transform: this.roundedRectangle.transform});
		return originalRectangle.produceEps(canvasHeightInPixels);
	}

	getEllipses(canvasHeightInPixels) {
		var ellipsesEps = [];
		var rx = this.roundedRectangle.rx;
		var ry = this.roundedRectangle.ry;

		if (this.roundedRectangle.width <= (2 * this.roundedRectangle.rx))  {
			rx = this.roundedRectangle.width / 2;
		}

		if (this.roundedRectangle.height <= (2 * this.roundedRectangle.ry))  {
			ry = this.roundedRectangle.height / 2;
		}

		if (this.roundedRectangle.height <= (2 * this.roundedRectangle.ry))  {
			console.log("logging cause it's less than height");
			return "\n";
		}

		var ellipseOne = new epsEllipse({rx: rx, ry:ry, cx: this.roundedRectangle.x + rx, cy: this.roundedRectangle.y + ry, transform: this.roundedRectangle.transform, fill:this.roundedRectangle.fill, stroke: this.roundedRectangle.stroke, strokeWidth: this.roundedRectangle.strokeWidth});
		var ellipseTwo = new epsEllipse({rx:rx, ry:ry, cx: this.roundedRectangle.x + this.roundedRectangle.width - rx, cy: this.roundedRectangle.y + ry, transform: this.roundedRectangle.transform, fill:this.roundedRectangle.fill, stroke: this.roundedRectangle.stroke, strokeWidth: this.roundedRectangle.strokeWidth});
		var ellipseThree = new epsEllipse({rx:rx, ry:ry, cx: this.roundedRectangle.x + this.roundedRectangle.width - rx, cy: this.roundedRectangle.y + this.roundedRectangle.height - ry, transform: this.roundedRectangle.transform, fill:this.roundedRectangle.fill, stroke: this.roundedRectangle.stroke, strokeWidth: this.roundedRectangle.strokeWidth});
		var ellipseFour = new epsEllipse({rx:rx, ry:ry, cx: this.roundedRectangle.x + rx, cy: this.roundedRectangle.y + this.roundedRectangle.height - ry, transform: this.roundedRectangle.transform, fill:this.roundedRectangle.fill, stroke: this.roundedRectangle.stroke, strokeWidth: this.roundedRectangle.strokeWidth});

		ellipsesEps[0] = ellipseOne.produceEps(canvasHeightInPixels);
		ellipsesEps[1] = ellipseTwo.produceEps(canvasHeightInPixels);
		ellipsesEps[2] = ellipseThree.produceEps(canvasHeightInPixels);
		ellipsesEps[3] = ellipseFour.produceEps(canvasHeightInPixels);

		return ellipsesEps;
	}
}

export default epsRoundedRectangle;