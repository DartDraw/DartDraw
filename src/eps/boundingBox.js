import epsShape from './epsShape';

class boundingBox {

	constructor(canvasHeight) {
		this.llx = Infinity;
		this.lly = Infinity;
		this.urx = -Infinity;
		this.ury = -Infinity;
		this.canvasHeight = canvasHeight;
		this.updateBoundsIfNecessary = this.updateBoundsIfNecessary.bind(this);
		this.updateBoundsRectangleHelper = this.updateBoundsRectangleHelper.bind(this);
		this.updateBoundsLineHelper = this.updateBoundsLineHelper.bind(this);
		this.updateBoundsEllipseHelper = this.updateBoundsEllipseHelper.bind(this);
	}

	updateBoundsIfNecessary(shape) {

		var str = shape.stroke;
		var rawRGB = str.substring(5, str.length-1);
		var array = rawRGB.split(',');

		var color = '';
		for (var i = 0; i < 3; i++) {
			color = color + array[0];
		}

		if (color === '255255255') {
			return;
		}

		switch (shape.type) {
			case "rectangle":
				this.updateBoundsRectangleHelper(shape);
				break;
			case "line":
				this.updateBoundsLineHelper(shape);
				break;
			case "ellipse":
				this.updateBoundsEllipseHelper(shape);
				break;
			default:
				break;
		}
	}

	updateBoundsRectangleHelper(shape) {
		var myShape = new epsShape(shape);
		var coords = myShape.getCoords();
		console.log(coords);

		for (var key in coords) {
		    // skip loop if the property is from prototype
		    if (!coords.hasOwnProperty(key)) continue;

		    var coord = coords[key];
		    for (var prop in coord) {
		        // skip loop if the property is from prototype
		        if(!coord.hasOwnProperty(prop)) continue;

			    console.log(coord);
			    if (coord.x < this.llx) {
					this.llx = coord.x;
				}
				if ((coord.x) > this.urx) {
					this.urx = coord.x;
				}
				if ((this.canvasHeight - coord.y) < this.lly) {
					this.lly = this.canvasHeight - coord.y;
				}
				if ((this.canvasHeight - coord.y) > this.ury) {
					this.ury = this.canvasHeight - coord.y;
				}
		    }
		}
	}

	updateBoundsLineHelper(shape) {
		var myShape = new epsShape(shape);
		var coords = myShape.getCoords();
		console.log(coords);

		for (var key in coords) {
		    // skip loop if the property is from prototype
		    if (!coords.hasOwnProperty(key)) continue;

		    var coord = coords[key];
		    for (var prop in coord) {
		        // skip loop if the property is from prototype
		        if(!coord.hasOwnProperty(prop)) continue;

			    console.log(coord);
			    if (coord.x < this.llx) {
					this.llx = coord.x;
				}
				if ((coord.x) > this.urx) {
					this.urx = coord.x;
				}
				if ((this.canvasHeight - coord.y) < this.lly) {
					this.lly = this.canvasHeight - coord.y;
				}
				if ((this.canvasHeight - coord.y) > this.ury) {
					this.ury = this.canvasHeight - coord.y;
				}
		    }
		}
	}

	updateBoundsEllipseHelper(shape) {
		this.llx = 0;
		this.lly = 0;
		this.urx = 850;
		this.ury = 850;
	}

}

export default boundingBox;