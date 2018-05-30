import epsRectangle from './epsRectangle';
import epsLine from './epsLine';
import epsEllipse from './epsEllipse';
import epsPolygon from './epsPolygon';
import epsArc from './epsArc';
import epsBezier from './epsBezier';
import epsText from './epsText';
import epsFreehandPath from './epsFreehandPath';
import epsRoundedRectangle from './epsRoundedRectangle';

class epsShape {

	constructor(shape) {
		this.shape = shape;
		this.produceEps = this.produceEps.bind(this);
		this.getCoords = this.getCoords.bind(this);
		this.getParams = this.getParams.bind(this);
		this.getStrokeWidth = this.getStrokeWidth.bind(this);
		this.getAngle = this.getAngle.bind(this);
		this.getControlPoints = this.getControlPoints.bind(this);
	}

	produceEps(canvasHeight, arrows) {
		switch(this.shape.type) {
			case "rectangle":
				if (this.shape.rx != 0) {
					var myRectangle = new epsRoundedRectangle(this.shape);
				} else {
					var myRectangle = new epsRectangle(this.shape);
				}
				var drawing = myRectangle.produceEps(canvasHeight);
				break;
			case "line":
				var myLine = new epsLine(this.shape, arrows);
				var drawing = myLine.produceEps(canvasHeight);
				break;
			case "ellipse":
				var myEllipse = new epsEllipse(this.shape);
				var drawing = myEllipse.produceEps(canvasHeight);
				break;
			case "polygon":
				var myPolygon = new epsPolygon(this.shape);
				var drawing = myPolygon.produceEps(canvasHeight);
				break;
			case "arc":
				var myArc = new epsArc(this.shape);
				var drawing = myArc.produceEps(canvasHeight);
				break;
			case "bezier":
				var myBezier = new epsBezier(this.shape);
				var drawing = myBezier.produceEps(canvasHeight);
				break;
			case "text":
				var myText = new epsText(this.shape);
				var drawing = myText.produceEps(canvasHeight);
				break;
			case "freehandPath":
				var myFreehandPath = new epsFreehandPath(this.shape);
				var drawing = myFreehandPath.produceEps(canvasHeight);
				break;
			default:
				var drawing = '';
				break;
		}
		return drawing;

	}

	getCoords() {
		switch(this.shape.type) {
			case "rectangle":
				var myRectangle = new epsRectangle(this.shape);
				return myRectangle.getCoords();
			case "line":
				var myLine = new epsLine(this.shape);
				return myLine.getCoords();
			case "ellipse":
				return {};
			case "polygon":
				var myPolygon = new epsPolygon(this.shape);
				return myPolygon.getCoords();
			case "bezier":
				var myBezier = new epsBezier(this.shape);
				return myBezier.getCoords();
			default:
				return {};
		}
	}

	getControlPoints() {
		switch(this.shape.type) {
			case "bezier":
				var myBezier = new epsBezier(this.shape);
				return myBezier.getControlPoints();
			default:
				return;
		}
	}

	getParams() {
		switch(this.shape.type) {
			case "ellipse":
				var myEllipse = new epsEllipse(this.shape);
				return myEllipse.getParams();
			case "arc":
				var myArc = new epsArc(this.shape);
				return myArc.getParams();
			case "bezier":
				var myBezier = new epsBezier(this.shape);
				return myBezier.getParams();
			default:
				return null;
		}
	}

	getTransform() {
		switch(this.shape.type) {
			case "arc":
				var myArc = new epsArc(this.shape);
				return myArc.getTransform();
			default:
				return null;
		}
	}

	getAngle(point) {
		switch(this.shape.type) {
			case "arc":
				var myArc = new epsArc(this.shape);
				return myArc.getAngle(point);
			default:
				return null;
		}
	}

	getRotate() {
		switch(this.shape.type) {
			case "arc":
				var myArc = new epsArc(this.shape);
				return myArc.getRotate();
			default:
				return null;
		}
	}

	getStrokeWidth() {
		switch(this.shape.type) {
			case "rectangle":
				var myRectangle = new epsRectangle(this.shape);
				return myRectangle.rectangle.strokeWidth;
			case "line":
				var myLine = new epsLine(this.shape);
				return myLine.line.strokeWidth;
			case "ellipse":
				var myEllipse = new epsEllipse(this.shape);
				return 1; // this is only a placeholder
			case "polygon":
				var myPolygon = new epsPolygon(this.shape);
				return myPolygon.polygon.strokeWidth;
			case "arc":
				var myArc = new epsArc(this.shape);
				return myArc.arc.strokeWidth;
			case "bezier":
				var myBezier = new epsBezier(this.shape);
				return myBezier.bezier.strokeWidth;
			default:
				return null;
		}
	}

}

export default epsShape;