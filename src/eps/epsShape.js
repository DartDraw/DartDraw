import epsRectangle from './epsRectangle';
import epsLine from './epsLine';
import epsEllipse from './epsEllipse';

class epsShape {

	constructor(shape) {
		this.shape = shape;
		this.produceEps = this.produceEps.bind(this);
		this.getCoords = this.getCoords.bind(this);
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
			default:
				return null;
		}
	}

}

export default epsShape;