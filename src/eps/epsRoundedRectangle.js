import { transformPoint } from '../reducers/utilities/matrix';
import epsEllipse from './epsEllipse';
import epsRectangle from "./epsRectangle";
import epsLine from "./epsLine";

class epsRoundedRectangle {

	constructor(roundedRectangle) {
		this.roundedRectangle = roundedRectangle;
		this.produceEps = this.produceEps.bind(this);
		this.getCoords = this.getCoords.bind(this);
		this.getLeftRectangle = this.getLeftRectangle.bind(this);
		this.getRightRectangle = this.getRightRectangle.bind(this);
		this.getCenterRectangle = this.getCenterRectangle.bind(this);
		this.getEllipses = this.getEllipses.bind(this);
		this.getLeftLine = this.getLeftLine.bind(this);
		this.getRightLine = this.getRightLine.bind(this);
		this.getTopLine = this.getTopLine.bind(this);
		this.getBottomLine = this.getBottomLine.bind(this);
	}

	produceEps(canvasHeightInPixels) {
		return;
// 		var leftRectangle = this.getLeftRectangle(canvasHeightInPixels);
// 		var leftRectangleEps = (leftRectangle !== null) ? leftRectangle.produceEps(canvasHeightInPixels) : "\n";

// 		var rightRectangle = this.getRightRectangle(canvasHeightInPixels);
// 		var rightRectangleEps = (rightRectangle !== null) ? rightRectangle.produceEps(canvasHeightInPixels) : "\n";

// 		var centerRectangle = this.getCenterRectangle(canvasHeightInPixels);
// 		var centerRectangleEps = (centerRectangle !== null) ? centerRectangle.produceEps(canvasHeightInPixels) : "\n";

// 		var leftLine = this.getLeftLine(canvasHeightInPixels);
// 		var leftLineEps = (leftLine !== null) ? leftLine.produceEps(canvasHeightInPixels) : "\n";

// 		var rightLine = this.getRightLine(canvasHeightInPixels);
// 		var rightLineEps = (rightLine !== null) ? rightLIne.produceEps(canvasHeightInPixels) : "\n";

// 		var topLine = this.getTopLine(canvasHeightInPixels);
// 		var topLineEps = (topLine !== null) ? topLIne.produceEps(canvasHeightInPixels) : "\n";

// 		var bottomLine = this.getBottomLine(canvasHeightInPixels);
// 		var bottomLineEps = (bottomLine !== null) ? bottomLIne.produceEps(canvasHeightInPixels) : "\n";

// 		const ellipses = this.getEllipses(canvasHeightInPixels);
// 		const ellipsesEps = [];
// 		let eps;
// 		for (var i = 0; i < ellipses.length; i++) {
// 			eps = ellipses[i].produceEps(canvasHeightInPixels);
// 			ellipsesEps.push(eps);
// 		}

// 		var drawingInfo = 
// `${ellipsesEps[0]}
// ${ellipsesEps[1]}
// ${ellipsesEps[2]}
// ${ellipsesEps[3]}
// ${leftRectangleEps}
// ${rightRectangleEps}
// ${centerRectangleEps}
// ${leftLine}
// ${rightLine}
// ${topLine}
// ${bottomLine}
// `;

		// return drawingInfo;

	}

	// getParams() {
	// 	return {
	// 		leftRectangle
	// 	}
	// }

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
			return null;
		}
		var leftRectangle = new epsRectangle({x: this.roundedRectangle.x, y: this.roundedRectangle.y + this.roundedRectangle.ry, width: this.roundedRectangle.rx, height: this.roundedRectangle.height - (2*this.roundedRectangle.ry), fill:this.roundedRectangle.fill, stroke: this.roundedRectangle.stroke, strokeWidth: this.roundedRectangle.strokeWidth, transform: this.roundedRectangle.transform});
		return leftRectangle;
	}

	getRightRectangle(canvasHeightInPixels) {
		if (this.roundedRectangle.height <= (2 * this.roundedRectangle.ry))  {
			console.log("logging cause it's less than height");
			return null;
		}
		var rightRectangle = new epsRectangle({x: this.roundedRectangle.x + this.roundedRectangle.width - this.roundedRectangle.rx, y: this.roundedRectangle.y + this.roundedRectangle.ry, width: this.roundedRectangle.rx, height: this.roundedRectangle.height - (2*this.roundedRectangle.ry), fill:this.roundedRectangle.fill, stroke: this.roundedRectangle.stroke, strokeWidth: this.roundedRectangle.strokeWidth, transform: this.roundedRectangle.transform});
		return rightRectangle;
	}

	getCenterRectangle(canvasHeightInPixels) {
		if (this.roundedRectangle.width <= (2 * this.roundedRectangle.rx))  {
			console.log("logging cause it's less than width");
			return null;
		}
		var centerRectangle = new epsRectangle({x: this.roundedRectangle.x + this.roundedRectangle.rx, y: this.roundedRectangle.y, width: this.roundedRectangle.rx - (2*this.roundedRectangle.rx), height: this.roundedRectangle.height, fill:this.roundedRectangle.fill, stroke: this.roundedRectangle.stroke, strokeWidth: this.roundedRectangle.strokeWidth, transform: this.roundedRectangle.transform});
		return centerRectangle;
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

		ellipsesEps[0] = ellipseOne;
		ellipsesEps[1] = ellipseTwo;
		ellipsesEps[2] = ellipseThree;
		ellipsesEps[3] = ellipseFour;
		return ellipsesEps;
	}

	getTopLine() {
		return;
	}
}

export default epsRoundedRectangle;