import epsRectangle from './epsRectangle';

class epsShape {

	constructor(shape) {
		this.shape = shape;
		this.produceEps = this.produceEps.bind(this);
	}

	produceEps(canvasHeight) {
		switch(this.shape.type) {
			case "rectangle":
				var myRectangle = new epsRectangle(this.shape);
				var drawing = myRectangle.produceEps(canvasHeight);
				break;
			default:
				var drawing = '';
				break;
		}



		console.log(drawing);
		return drawing;

	}

}

export default epsShape;
