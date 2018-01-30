import epsShape from './epsShape';

class boundingBox {

	constructor(canvasHeightInPixels) {
		this.llx = Infinity;
		this.lly = Infinity;
		this.urx = -Infinity;
		this.ury = -Infinity;
		this.canvasHeightInPixels = canvasHeightInPixels;
		this.updateBoundsIfNecessary = this.updateBoundsIfNecessary.bind(this);
		this.updateBoundsRectangleHelper = this.updateBoundsRectangleHelper.bind(this);
		this.updateBoundsLineHelper = this.updateBoundsLineHelper.bind(this);
		this.updateBoundsEllipseHelper = this.updateBoundsEllipseHelper.bind(this);
		this.updateBoundsPolygonHelper = this.updateBoundsPolygonHelper.bind(this);
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
			case "polygon":
				this.updateBoundsPolygonHelper(shape);
				break;
			default:
				break;
		}
	}

	updateBoundsRectangleHelper(shape) {
		var myShape = new epsShape(shape);
		var coords = myShape.getCoords();

		for (var key in coords) {
		    // skip loop if the property is from prototype
		    if (!coords.hasOwnProperty(key)) continue;

		    var coord = coords[key];
		    for (var prop in coord) {
		        // skip loop if the property is from prototype
		        if(!coord.hasOwnProperty(prop)) continue;

			    if (coord.x < this.llx) {
					this.llx = coord.x;
				}
				if ((coord.x) > this.urx) {
					this.urx = coord.x;
				}
				if ((this.canvasHeightInPixels - coord.y) < this.lly) {
					this.lly = this.canvasHeightInPixels - coord.y;
				}
				if ((this.canvasHeightInPixels - coord.y) > this.ury) {
					this.ury = this.canvasHeightInPixels - coord.y;
				}
		    }
		}
	}

	updateBoundsLineHelper(shape) {
		var myShape = new epsShape(shape);
		var coords = myShape.getCoords();

		for (var key in coords) {
		    // skip loop if the property is from prototype
		    if (!coords.hasOwnProperty(key)) continue;

		    var coord = coords[key];
		    for (var prop in coord) {
		        // skip loop if the property is from prototype
		        if(!coord.hasOwnProperty(prop)) continue;

			    if (coord.x < this.llx) {
					this.llx = coord.x;
				}
				if ((coord.x) > this.urx) {
					this.urx = coord.x;
				}
				if ((this.canvasHeightInPixels - coord.y) < this.lly) {
					this.lly = this.canvasHeightInPixels - coord.y;
				}
				if ((this.canvasHeightInPixels - coord.y) > this.ury) {
					this.ury = this.canvasHeightInPixels - coord.y;
				}
		    }
		}
	}

	updateBoundsEllipseHelper(shape) {
		var myShape = new epsShape(shape);
		var params = myShape.getParams();
		var cx = params.cx;
		var cy = params.cy;
		var rx = params.rx;
		var ry = params.ry;
		var alpha = params.alpha * (Math.PI/180);

		var xA = (ry**2) * ((Math.sin(alpha))**2) + (rx**2) * ((Math.cos(alpha))**2);
		var yA = (ry**2) * ((Math.cos(alpha))**2) + (rx**2) * ((Math.sin(alpha))**2);

		var yNumerator = yA * (rx**2) * (ry**2) * -1;
		var yDenominator = ((Math.cos(alpha))**2 * (Math.sin(alpha))**2 * ((ry**2)-(rx)**2)**2) - (yA * xA);
		var y = Math.sqrt(yNumerator/yDenominator);
		var maxY = y + cy;
		var minY = y * -1 + cy;
		
		var xNumerator = xA * (rx**2) * (ry**2) * -1;
		var xDenominator = ((Math.cos(alpha))**2 * (Math.sin(alpha))**2 * ((ry**2)-(rx)**2)**2) - (xA * yA);
		var x = Math.sqrt(xNumerator/xDenominator);
		var maxX = x + cx;
		var minX = x * -1 + cx;

		if (minX < this.llx) {
			this.llx = minX;
		}
		if (maxX > this.urx) {
			this.urx = maxX;
		}
		if ((this.canvasHeightInPixels - maxY) < this.lly) {
			this.lly = this.canvasHeightInPixels - maxY;
		}
		if ((this.canvasHeightInPixels - minY) > this.ury) {
			this.ury = this.canvasHeightInPixels - minY;
		}
	}

	updateBoundsPolygonHelper(shape) {
		var myShape = new epsShape(shape);
		var coords = myShape.getCoords();

		for (var key in coords) {
		    // skip loop if the property is from prototype
		    if (!coords.hasOwnProperty(key)) continue;

		    var coord = coords[key];
		    for (var prop in coord) {
		        // skip loop if the property is from prototype
		        if(!coord.hasOwnProperty(prop)) continue;

			    if (coord.x < this.llx) {
					this.llx = coord.x;
				}
				if ((coord.x) > this.urx) {
					this.urx = coord.x;
				}
				if ((this.canvasHeightInPixels - coord.y) < this.lly) {
					this.lly = this.canvasHeightInPixels - coord.y;
				}
				if ((this.canvasHeightInPixels - coord.y) > this.ury) {
					this.ury = this.canvasHeightInPixels - coord.y;
				}
		    }
		}
	}

}

export default boundingBox;