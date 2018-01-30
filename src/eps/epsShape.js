import epsRectangle from './epsRectangle';
import epsLine from './epsLine';
import epsEllipse from './epsEllipse';
import epsPolygon from './epsPolygon';

class epsShape {

	constructor(shape) {
		this.shape = shape;
		this.produceEps = this.produceEps.bind(this);
		this.getCoords = this.getCoords.bind(this);
		this.getParams = this.getParams.bind(this);
		this.getStrokeWidth = this.getStrokeWidth.bind(this);
	}

	produceEps(canvasHeight) {
		switch(this.shape.type) {
			case "rectangle":
				var myRectangle = new epsRectangle(this.shape);
				var drawing = myRectangle.produceEps(canvasHeight);
				break;
			case "line":
				var myLine = new epsLine(this.shape);
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
			default:
				var drawing = '';
				break;
		}

		console.log(drawing);
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
				var myEllipse = new epsEllipse(this.shape);
				break;
			case "polygon":
				var myPolygon = new epsPolygon(this.shape);
				return myPolygon.getCoords();
			default:
				return null;
		}
	}

	getParams() {
		switch(this.shape.type) {
			case "ellipse":
				var myEllipse = new epsEllipse(this.shape);
				return myEllipse.getParams();
			default:
				return null;
		}
	}

	getStrokeWidth() {
		switch(this.shape.type) {
			case "rectangle":
				var myRectangle = new epsRectangle(this.shape);
				return myRectangle.strokeWidth;
			case "line":
				var myLine = new epsLine(this.shape);
				return myLine.strokeWidth;
			case "ellipse":
				var myEllipse = new epsEllipse(this.shape);
				console.log("return ellipse strokeWidth");
				console.log(myEllipse.strokeWidth);
				return myEllipse.strokeWidth;
			case "polygon":
				var myPolygon = new epsPolygon(this.shape);
				return myPolygon.strokeWidth;
			default:
				return null;
		}
	}

}

export default epsShape;