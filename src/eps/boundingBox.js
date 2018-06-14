import epsShape from './epsShape';
var math = window.require('mathjs');
math.config({
  number: 'BigNumber', // Default type of number:
                       // 'number' (default), 'BigNumber', or 'Fraction'
  precision: 128        // Number of significant digits for BigNumbers
});

class boundingBox {

	constructor(canvasHeightInPixels, canvasWidthInPixels) {
		this.llx = 1000000000;
		this.lly = 1000000000;
		this.urx = 0;
		this.ury = 0;
		this.canvasHeightInPixels = canvasHeightInPixels;
		this.updateBoundsIfNecessary = this.updateBoundsIfNecessary.bind(this);
		this.updateBoundsRectangle = this.updateBoundsRectangle.bind(this);
		this.updateBoundsLine = this.updateBoundsLine.bind(this);
		this.updateBoundsFreehandPath = this.updateBoundsFreehandPath.bind(this);
		this.updateBoundsRectangleHelper = this.updateBoundsRectangleHelper.bind(this);
		this.updateBoundsEllipseHelper = this.updateBoundsEllipseHelper.bind(this);
		this.updateBoundsPolygonHelper = this.updateBoundsPolygonHelper.bind(this);
		this.updateBoundsBezierHelper = this.updateBoundsBezierHelper.bind(this);
		this.updateBoundsArrowHelper = this.updateBoundsArrowHelper.bind(this);
		this.updateBoundsTextHelper = this.updateBoundsTextHelper.bind(this);
		this.quadraticSolverForY = this.quadraticSolverForY.bind(this);
		this.normalizeAngle = this.normalizeAngle.bind(this);
	}

	// takes angle in radians
	normalizeAngle(angle) {
		if (angle >= 0) {
			return angle;
		} else {
			return ((2*Math.PI) + angle);
		}
	}

	quadraticSolverForY(semiMajorAxis, semiMinorAxis, cx, cy, theta, x) {
		var A = math.add(math.multiply(math.pow(semiMajorAxis,math.bignumber(2)), math.pow(math.sin(theta),math.bignumber(2))), math.multiply(math.pow(semiMinorAxis,math.bignumber(2)), math.pow(math.cos(theta),math.bignumber(2))));
		var B = math.multiply(math.bignumber(2), math.subtract(math.pow(semiMinorAxis,math.bignumber(2)), math.pow(semiMajorAxis,math.bignumber(2))), math.sin(theta), math.cos(theta));
		var C = math.add(math.multiply(math.pow(semiMajorAxis,math.bignumber(2)), math.pow(math.cos(theta),math.bignumber(2))), math.multiply(math.pow(semiMinorAxis,math.bignumber(2)), math.pow(math.sin(theta),math.bignumber(2))));
		var D = math.subtract(math.multiply(math.bignumber(-2), A, cx), math.multiply(B, cy));
		var E = math.subtract(math.multiply(math.bignumber(-1), B, cx), math.multiply(math.bignumber(2), C, cy));
		var F = math.add(math.multiply(A, math.pow(cx,math.bignumber(2))), math.multiply(B, cx, cy), math.multiply(C, math.pow(cy,math.bignumber(2))), math.multiply(math.bignumber(-1), math.pow(semiMajorAxis,math.bignumber(2)), math.pow(semiMinorAxis,math.bignumber(2))));

		var firstCoefficient = C;
		var secondCoefficient = math.add(math.multiply(B, x), E);
		var thirdCoefficient = math.add(math.multiply(A, math.pow(x,math.bignumber(2))), math.multiply(D,x), F);

		var diff = math.subtract(math.pow(secondCoefficient,math.bignumber(2)), math.multiply(math.bignumber(4), firstCoefficient, thirdCoefficient));
		var helperTerm = math.sqrt(math.subtract(math.pow(secondCoefficient,math.bignumber(2)), math.multiply(math.bignumber(4), firstCoefficient, thirdCoefficient)));
		
		if ( math.smaller(math.divide(diff, math.pow(secondCoefficient, 2)), math.divide(1, 1000000)) ) {
			helperTerm = 0;
		}

		var firstPotentialY = math.divide(math.add(math.multiply(math.bignumber(-1), secondCoefficient), helperTerm), math.multiply(math.bignumber(2), firstCoefficient));
		var secondPotentialY = math.divide(math.subtract(math.multiply(math.bignumber(-1), secondCoefficient), helperTerm), math.multiply(math.bignumber(2), firstCoefficient));

		return firstPotentialY;
	}

	quadraticSolverForX(semiMajorAxis, semiMinorAxis, cx, cy, theta, y) {
		var A = math.add(math.multiply(math.pow(semiMajorAxis,math.bignumber(2)), math.pow(math.sin(theta),math.bignumber(2))), math.multiply(math.pow(semiMinorAxis,math.bignumber(2)), math.pow(math.cos(theta),math.bignumber(2))));
		var B = math.multiply(math.bignumber(2), math.subtract(math.pow(semiMinorAxis,math.bignumber(2)), math.pow(semiMajorAxis,math.bignumber(2))), math.sin(theta), math.cos(theta));
		var C = math.add(math.multiply(math.pow(semiMajorAxis,math.bignumber(2)), math.pow(math.cos(theta),math.bignumber(2))), math.multiply(math.pow(semiMinorAxis,math.bignumber(2)), math.pow(math.sin(theta),math.bignumber(2))));
		var D = math.subtract(math.multiply(math.bignumber(-2), A, cx), math.multiply(B, cy));
		var E = math.subtract(math.multiply(math.bignumber(-1), B, cx), math.multiply(math.bignumber(2), C, cy));
		var F = math.add(math.multiply(A, math.pow(cx,math.bignumber(2))), math.multiply(B, cx, cy), math.multiply(C, math.pow(cy,math.bignumber(2))), math.multiply(math.bignumber(-1), math.pow(semiMajorAxis,math.bignumber(2)), math.pow(semiMinorAxis,math.bignumber(2))));

		var firstCoefficient = A;
		var secondCoefficient = math.add(math.multiply(B, y), D);
		var thirdCoefficient = math.add(math.multiply(C, math.pow(y,math.bignumber(2))), math.multiply(E,y), F);

		var diff = math.subtract(math.pow(secondCoefficient,math.bignumber(2)), math.multiply(math.bignumber(4), firstCoefficient, thirdCoefficient));
		var helperTerm = math.sqrt(math.subtract(math.pow(secondCoefficient,math.bignumber(2)), math.multiply(math.bignumber(4), firstCoefficient, thirdCoefficient)));
		
		if ( math.smaller(math.divide(diff, math.pow(secondCoefficient, 2)), math.divide(1, 1000000)) ) {
			helperTerm = 0;
		}

		var firstPotentialX = math.divide(math.add(math.multiply(math.bignumber(-1), secondCoefficient), helperTerm), math.multiply(math.bignumber(2), firstCoefficient));
		var secondPotentialX = math.divide(math.subtract(math.multiply(math.bignumber(-1), secondCoefficient), helperTerm), math.multiply(math.bignumber(2), firstCoefficient));

		return firstPotentialX;
	}

	updateBoundsIfNecessary(shape) {
		var str;
		if (shape.type == 'text') {
			str = shape.fill;
		} else if (shape.type == 'arrow'){
			str = shape.arrow.stroke;
		} else {
			str = shape.stroke;
		}
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
				this.updateBoundsRectangle(shape);
				break;
			case "line":
				this.updateBoundsLine(shape);
				break;
			case "freehandPath":
				this.updateBoundsFreehandPath(shape);
				break;
			case "ellipse":
				this.updateBoundsEllipseHelper(shape);
				break;
			case "polygon":
				this.updateBoundsPolygonHelper(shape);
				break;
			case "arc":
				this.updateBoundsArcHelper(shape);
				break;
			case "bezier":
				this.updateBoundsBezierHelper(shape);
				break;
			case "arrow":
				this.updateBoundsArrowHelper(shape);
				break;
			case "text":
				this.updateBoundsTextHelper(shape);
			default:
				break;
		}
	}

	updateBoundsTextHelper(shape) {
		const myShape = new epsShape(shape);
		const coords = myShape.getCoords();
		let x, y;
		for (var i = 0; i < coords.length; i++) {
			x = coords[i].x;
			y = coords[i].y;

			// first check endpoints
		    if (x < this.llx) {
				this.llx = x;
			}
			if (x > this.urx) {
				this.urx = x;
			}
			if ((this.canvasHeightInPixels - y) < this.lly) {
				this.lly = this.canvasHeightInPixels - y;
			}
			if ((this.canvasHeightInPixels - y) > this.ury) {
				this.ury = this.canvasHeightInPixels - y;
			}
		}
	}

	updateBoundsArrowHelper(shape) {
		const coords = shape.getCoords();
		console.log("logging arrow coords");
		console.log(coords);
		let x, y;
		for (var i = 0; i < coords.length; i++) {
			x = coords[i].x;
			y = coords[i].y;

			// first check endpoints
		    if (x < this.llx) {
				this.llx = x;
			}
			if (x > this.urx) {
				this.urx = x;
			}
			if ((this.canvasHeightInPixels - y) < this.lly) {
				this.lly = this.canvasHeightInPixels - y;
			}
			if ((this.canvasHeightInPixels - y) > this.ury) {
				this.ury = this.canvasHeightInPixels - y;
			}
		}
	}

	updateBoundsBezierHelper(shape) {
		const myShape = new epsShape(shape);
		const strokeWidth = myShape.getStrokeWidth()/2;
		const coords = myShape.getCoords();
		const controlPoints = myShape.getControlPoints();
		const points = coords;

		var i;
		let controlPointOne, controlPointTwo;
		for (i = 0; i < controlPoints.length; i++) {
			controlPointOne = controlPoints[i][0];
			controlPointTwo = controlPoints[i][1];
			points.push(controlPointOne);
			points.push(controlPointTwo);
		}

		console.log("logging points for bezier");
		console.log(points);

		let point;
		for (i = 0; i < points.length; i++) {
			point = points[i];

			if (point.x - strokeWidth < this.llx) {
				this.llx = point.x - strokeWidth;
			}
			if (this.canvasHeightInPixels - point.y - strokeWidth < this.lly) {
				this.lly = this.canvasHeightInPixels - point.y - strokeWidth;
			}
			if (point.x + strokeWidth > this.urx) {
				this.urx = point.x + strokeWidth;
			}
			if (this.canvasHeightInPixels - point.y + strokeWidth > this.ury) {
				this.ury = this.canvasHeightInPixels - point.y + strokeWidth;
			}
		}
	}

	updateBoundsRectangle(shape) {
		var myShape = new epsShape(shape);
		var coords = myShape.getCoords();
		var strokeWidth = myShape.getStrokeWidth();

		let lastIndex = coords.length-1;
		for (var i=0; i < lastIndex; i++) {
			this.updateBoundsRectangleHelper(coords[i], coords[i+1], strokeWidth, true);
		}
		this.updateBoundsRectangleHelper(coords[lastIndex], coords[0], strokeWidth, true);
	}


	updateBoundsRectangleHelper(point1, point2, strokeWidth, partOfRectangle) {
		console.log("entered updateBoundsRectangleHelper");
		var halfStrokeWidth = math.divide(math.bignumber(strokeWidth),math.bignumber(2));
		var baseAdjacent = math.subtract(math.bignumber(point2.x), math.bignumber(point1.x));
		var baseOpposite = math.subtract(math.bignumber(point2.y), math.bignumber(point1.y));
		var lineAngle = math.atan2(baseOpposite, baseAdjacent);

		var angle, hypotenuseLength, xDiff, yDiff;

		if (partOfRectangle) {
			angle = math.subtract(lineAngle, math.divide(math.pi,math.bignumber(4)));
			hypotenuseLength = math.multiply(math.sqrt(math.bignumber(2)),halfStrokeWidth);
			xDiff = math.multiply(hypotenuseLength,math.cos(angle));
			yDiff = math.multiply(hypotenuseLength,math.sin(angle));

			var newPointX = math.add(math.bignumber(point2.x),xDiff);
			var newPointY = math.add(math.bignumber(point2.y), yDiff);

			if (math.smaller(newPointX, math.bignumber(this.llx))) {
				this.llx = math.number(newPointX);
			}

			if (math.smaller(math.subtract(math.bignumber(this.canvasHeightInPixels),newPointY),math.bignumber(this.lly))) {
				this.lly = math.number(math.subtract(math.bignumber(this.canvasHeightInPixels),newPointY));
			}

			if (math.larger(newPointX, math.bignumber(this.urx))) {
				this.urx = math.number(newPointX);
			}

			if (math.larger(math.subtract(math.bignumber(this.canvasHeightInPixels),newPointY),math.bignumber(this.ury))) {
				this.ury = math.number(math.subtract(math.bignumber(this.canvasHeightInPixels),newPointY));
			}


		} else {
			angle = math.add(lineAngle, math.divide(math.pi,math.bignumber(2)));
			hypotenuseLength = halfStrokeWidth;
			xDiff = math.multiply(hypotenuseLength,math.cos(angle));
			yDiff = math.multiply(hypotenuseLength,math.sin(angle));

			var newPointOneFirstX = math.add(math.bignumber(point1.x),xDiff);
			var newPointOneFirstY = math.add(math.bignumber(point1.y), yDiff);

			if (math.smaller(newPointOneFirstX, math.bignumber(this.llx))) {
				this.llx = math.number(newPointOneFirstX);
			}

			if (math.smaller(math.subtract(math.bignumber(this.canvasHeightInPixels),newPointOneFirstY),math.bignumber(this.lly))) {
				this.lly = math.number(math.subtract(math.bignumber(this.canvasHeightInPixels),newPointOneFirstY));
			}

			if (math.larger(newPointOneFirstX, math.bignumber(this.urx))) {
				this.urx = math.number(newPointOneFirstX);
			}

			if (math.larger(math.subtract(math.bignumber(this.canvasHeightInPixels),newPointOneFirstY),math.bignumber(this.ury))) {
				this.ury = math.number(math.subtract(math.bignumber(this.canvasHeightInPixels),newPointOneFirstY));
			}

			var newPointOneSecondX = math.subtract(math.bignumber(point1.x),xDiff);
			var newPointOneSecondY = math.subtract(math.bignumber(point1.y), yDiff);

			if (math.smaller(newPointOneSecondX, math.bignumber(this.llx))) {
				this.llx = math.number(newPointOneSecondX);
			}

			if (math.smaller(math.subtract(math.bignumber(this.canvasHeightInPixels),newPointOneSecondY),math.bignumber(this.lly))) {
				this.lly = math.number(math.subtract(math.bignumber(this.canvasHeightInPixels),newPointOneSecondY));
			}

			if (math.larger(newPointOneSecondX, math.bignumber(this.urx))) {
				this.urx = math.number(newPointOneSecondX);
			}

			if (math.larger(math.subtract(math.bignumber(this.canvasHeightInPixels),newPointOneSecondY),math.bignumber(this.ury))) {
				this.ury = math.number(math.subtract(math.bignumber(this.canvasHeightInPixels),newPointOneSecondY));
			}

			var newPointTwoFirstX = math.add(math.bignumber(point2.x),xDiff);
			var newPointTwoFirstY = math.add(math.bignumber(point2.y), yDiff);

			if (math.smaller(newPointTwoFirstX, math.bignumber(this.llx))) {
				this.llx = math.number(newPointTwoFirstX);
			}

			if (math.smaller(math.subtract(math.bignumber(this.canvasHeightInPixels),newPointTwoFirstY),math.bignumber(this.lly))) {
				this.lly = math.number(math.subtract(math.bignumber(this.canvasHeightInPixels),newPointTwoFirstY));
			}

			if (math.larger(newPointTwoFirstX, math.bignumber(this.urx))) {
				this.urx = math.number(newPointTwoFirstX);
			}

			if (math.larger(math.subtract(math.bignumber(this.canvasHeightInPixels),newPointTwoFirstY),math.bignumber(this.ury))) {
				this.ury = math.number(math.subtract(math.bignumber(this.canvasHeightInPixels),newPointTwoFirstY));
			}

			var newPointTwoSecondX = math.subtract(math.bignumber(point2.x),xDiff);
			var newPointTwoSecondY = math.subtract(math.bignumber(point2.y), yDiff);

			if (math.smaller(newPointTwoSecondX, math.bignumber(this.llx))) {
				this.llx = math.number(newPointTwoSecondX);
			}

			if (math.smaller(math.subtract(math.bignumber(this.canvasHeightInPixels),newPointTwoSecondY),math.bignumber(this.lly))) {
				this.lly = math.number(math.subtract(math.bignumber(this.canvasHeightInPixels),newPointTwoSecondY));
			}

			if (math.larger(newPointTwoSecondX, math.bignumber(this.urx))) {
				this.urx = math.number(newPointTwoSecondX);
			}

			if (math.larger(math.subtract(math.bignumber(this.canvasHeightInPixels),newPointTwoSecondY),math.bignumber(this.ury))) {
				this.ury = math.number(math.subtract(math.bignumber(this.canvasHeightInPixels),newPointTwoSecondY));
			}
		}
	}

	updateBoundsFreehandPath(shape) {
		var myShape = new epsShape(shape);
		var coords = myShape.getCoords();
		var strokeWidth = myShape.getStrokeWidth();

		let coord1, coord2;
		for (var i = 0; i < coords.length-1; i++) {
			coord1 = coords[i];
			coord2 = coords[i+1];
			this.updateBoundsRectangleHelper(coord1,coord2,strokeWidth,false);
		}
	}

	updateBoundsLine(shape) {
		var myShape = new epsShape(shape);
		var coords = myShape.getCoords();
		var strokeWidth = myShape.getStrokeWidth();

		this.updateBoundsRectangleHelper(coords[0], coords[1], strokeWidth, false);
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
		
		var xNumerator = xA * (rx**2) * (ry**2) * -1;
		var xDenominator = ((Math.cos(alpha))**2 * (Math.sin(alpha))**2 * ((ry**2)-(rx)**2)**2) - (xA * yA);
		var x = Math.sqrt(xNumerator/xDenominator);
		var maxX = x + cx;
		var minX = x * -1 + cx;

		var yNumerator = yA * (rx**2) * (ry**2) * -1;
		var yDenominator = ((Math.cos(alpha))**2 * (Math.sin(alpha))**2 * ((ry**2)-(rx)**2)**2) - (yA * xA);
		var y = Math.sqrt(yNumerator/yDenominator);
		var maxY = y + cy;
		var minY = y * -1 + cy;

		var strokeWidth = myShape.getStrokeWidth() / 2;

		if (minX - strokeWidth < this.llx) {
			this.llx = minX - strokeWidth;
		}
		if (maxX + strokeWidth > this.urx) {
			this.urx = maxX + strokeWidth;
		}
		if ((this.canvasHeightInPixels - maxY - strokeWidth) < this.lly) {
			this.lly = this.canvasHeightInPixels - maxY - strokeWidth;
		}
		if ((this.canvasHeightInPixels - minY + strokeWidth) > this.ury) {
			this.ury = this.canvasHeightInPixels - minY + strokeWidth;
		}
	}

	updateBoundsPolygonHelper(shape) {
		var myShape = new epsShape(shape);
		var coords = myShape.getCoords();
		var halfStrokeWidth = math.divide(myShape.getStrokeWidth(),math.bignumber(2));

		let index, secondIndex, thirdIndex;
		let pointOne, pointTwo, pointThree;
		let vectorOne, vectorTwo, dotProduct;
		let vectorOneLength, vectorTwoLength;
		let cosOmega, omega;
		let vLength;
		let dx, dy;
		let theta, phi;
		let xDiff, yDiff;
		let newPointX, newPointY;

		for (var i=0; i < coords.length-1; i++) {
			// we need three points to determine angles
			index = i;
			secondIndex = i+1;
			thirdIndex = i+2;

			// wrap around
			if (index == coords.length-3) {
				thirdIndex = 0;
			}
			if (index == coords.length-2) {
				secondIndex = 0;
				thirdIndex = 1;
			}

			pointOne = coords[index];
			pointTwo = coords[secondIndex];
			pointThree = coords[thirdIndex];

			// check to see if we can ignore this corner
			if (pointTwo.x >= pointOne.x && pointThree.x >= pointTwo.x) {
				if ((pointTwo.y >= pointOne.y && pointThree.y >= pointTwo.y) || (pointTwo.y <= pointOne.y && pointThree.y <= pointTwo.y)) {
					continue;
				}
			}
			if (pointTwo.x <= pointOne.x && pointThree.x <= pointTwo.x) {
				if ((pointTwo.y >= pointOne.y && pointThree.y >= pointTwo.y) || (pointTwo.y <= pointOne.y && pointThree.y <= pointTwo.y)) {
					continue;
				}
			}

			vectorOneLength = math.sqrt(math.add(math.pow(math.subtract(math.bignumber(pointTwo.x),math.bignumber(pointOne.x)),math.bignumber(2)),math.pow(math.subtract(math.bignumber(pointTwo.y),math.bignumber(pointOne.y)),math.bignumber(2))));
			vectorTwoLength = math.sqrt(math.add(math.pow(math.subtract(math.bignumber(pointThree.x),math.bignumber(pointTwo.x)),math.bignumber(2)),math.pow(math.subtract(math.bignumber(pointThree.y),math.bignumber(pointTwo.y)),math.bignumber(2))));
			dotProduct = math.add(math.multiply(math.subtract(math.bignumber(pointOne.x),math.bignumber(pointTwo.x)),math.subtract(math.bignumber(pointThree.x),math.bignumber(pointTwo.x))),math.multiply(math.subtract(math.bignumber(pointOne.y),math.bignumber(pointTwo.y)),math.subtract(math.bignumber(pointThree.y),math.bignumber(pointTwo.y))));

			cosOmega = math.divide(dotProduct,math.multiply(vectorOneLength,vectorTwoLength));
			omega = math.acos(cosOmega);
			console.log("logging omega");
			console.log(math.number(omega));

			vLength = math.multiply(halfStrokeWidth,math.csc(math.divide(omega,math.bignumber(2))));
			console.log("logging vLength");
			console.log(math.number(vLength));

			dx = math.subtract(math.bignumber(pointTwo.x), math.bignumber(pointOne.x));
			dy = math.subtract(math.bignumber(pointTwo.y), math.bignumber(pointOne.y));
			theta = math.atan2(dy,dx);
			console.log("logging theta");
			console.log(math.number(theta));
			phi = math.add(theta,math.divide(omega,math.bignumber(2)));
			console.log("logging phi");
			console.log(math.number(phi));

			xDiff = math.multiply(math.cos(phi),vLength);
			yDiff = math.multiply(math.sin(phi),vLength);

			newPointX = math.add(math.bignumber(pointTwo.x),xDiff);
			newPointY = math.add(math.bignumber(pointTwo.y), yDiff);

			if (math.smaller(newPointX, math.bignumber(this.llx))) {
				this.llx = math.number(newPointX);
			}

			if (math.smaller(math.subtract(math.bignumber(this.canvasHeightInPixels),newPointY),math.bignumber(this.lly))) {
				this.lly = math.number(math.subtract(math.bignumber(this.canvasHeightInPixels),newPointY));
			}

			if (math.larger(newPointX, math.bignumber(this.urx))) {
				this.urx = math.number(newPointX);
			}

			if (math.larger(math.subtract(math.bignumber(this.canvasHeightInPixels),newPointY),math.bignumber(this.ury))) {
				this.ury = math.number(math.subtract(math.bignumber(this.canvasHeightInPixels),newPointY));
			}

			// // this is all to get the angle between the two vectors
			// // first we get the length of the vectors
			// let vectorOneLength = math.sqrt(math.add(math.pow(math.subtract(math.bignumber(pointOne.x),math.bignumber(pointTwo.x)),math.bignumber(2)),math.pow(math.subtract(math.bignumber(pointOne.y),math.bignumber(pointTwo.y)),math.bignumber(2))));
			// let vectorTwoLength = math.sqrt(math.add(math.pow(math.subtract(math.bignumber(pointTwo.x),math.bignumber(pointThree.x)),math.bignumber(2)),math.pow(math.subtract(math.bignumber(pointTwo.y),math.bignumber(pointThree.y)),math.bignumber(2))));
			// // then we normalize the vectors (both originating at pointTwo)
			// let vectorOne = [math.divide(math.subtract(math.bignumber(pointOne.x),math.bignumber(pointTwo.x)),vectorOneLength), math.divide(math.subtract(math.bignumber(pointOne.y),math.bignumber(pointTwo.y)),vectorOneLength)];
			// let vectorTwo = [math.divide(math.subtract(math.bignumber(pointThree.x),math.bignumber(pointTwo.x)),vectorTwoLength), math.divide(math.subtract(math.bignumber(pointThree.y),math.bignumber(pointTwo.y)),vectorTwoLength)];
			// // and get the angle between the vectors
			// let cosAngle = math.add(math.multiply(vectorOne[0],vectorTwo[0]),math.multiply(vectorOne[1],vectorTwo[1]));
			// let angle = math.acos(cosAngle);

			// // this is gathering other data we need
			// let middleLineLength = math.divide(halfStrokeWidth,math.sin(math.divide(angle,math.bignumber(2))));
			// let theta = math.asec(vectorOneLength);
			// // check to make sure the angle isn't pi/2
			// if (undefined === theta) {
			// 	theta = math.divide(math.pi,math.bignumber(2));
			// }

			// // now we get the values to check
			// let phi = math.subtract(theta,math.divide(angle,math.bignumber(2)));
			// let horizontal = math.abs(math.multiply(middleLineLength,math.sin(phi)));
			// let vertical = math.abs(math.multiply(middleLineLength,math.cos(phi)));


			// if (math.smaller(math.subtract(math.bignumber(pointTwo.x),horizontal),math.bignumber(this.llx))) {
			// 	this.llx = math.number(math.subtract(math.bignumber(pointTwo.x),horizontal));
			// }
			// if (math.smaller(math.subtract(this.canvasHeightInPixels,math.add(math.bignumber(pointTwo.y),vertical)),math.bignumber(this.lly))) {
			// 	this.lly = math.number(math.subtract(this.canvasHeightInPixels,math.add(math.bignumber(pointTwo.y),vertical)));
			// }
			// if (math.larger(math.add(math.bignumber(pointTwo.x),horizontal),math.bignumber(this.urx))) {
			// 	this.urx = math.number(math.add(math.bignumber(pointTwo.x),horizontal));
			// }
			// if (math.larger(math.subtract(this.canvasHeightInPixels,math.subtract(math.bignumber(pointTwo.y),vertical)),math.bignumber(this.ury))) {
			// 	this.ury = math.number(math.subtract(this.canvasHeightInPixels,math.subtract(math.bignumber(pointTwo.y),vertical)));
			// }
		}
	}

	updateBoundsArcHelper(shape) {
		var myShape = new epsShape(shape);
		var params = myShape.getParams();
		var cx = params.cx;
		var cy = params.cy;
		var rx = params.rx;
		var ry = params.ry;
		var firstAngleBase = params.firstAngle * (Math.PI/180);
		var secondAngleBase = params.secondAngle * (Math.PI/180);
		var firstAngleRotated = params.firstAngleRotated * (Math.PI/180);
		var secondAngleRotated = params.secondAngleRotated * (Math.PI/180);
		var firstEndPointExtremum = params.firstEndPointExtremum;
		var secondEndPointExtremum = params.secondEndPointExtremum;
		var alpha = params.alpha * (Math.PI/180);
		var flipArc = params.flipArc;

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

		var semiMajorAxis = rx;
		var semiMinorAxis = ry;
		var theta = alpha;

		const rotatedExtrema = {};
		rotatedExtrema[0] = {x: minX, y: math.number(this.quadraticSolverForY(math.bignumber(semiMajorAxis), math.bignumber(semiMinorAxis), math.bignumber(cx), math.bignumber(cy), math.bignumber(theta), math.bignumber(minX)))};
		rotatedExtrema[1] = {x: maxX, y: math.number(this.quadraticSolverForY(math.bignumber(semiMajorAxis), math.bignumber(semiMinorAxis), math.bignumber(cx), math.bignumber(cy), math.bignumber(theta), math.bignumber(maxX)))};
		rotatedExtrema[2] = {x: math.number(this.quadraticSolverForX(math.bignumber(semiMajorAxis), math.bignumber(semiMinorAxis), math.bignumber(cx), math.bignumber(cy), math.bignumber(theta), math.bignumber(minY))), y: minY};
		rotatedExtrema[3] = {x: math.number(this.quadraticSolverForX(math.bignumber(semiMajorAxis), math.bignumber(semiMinorAxis), math.bignumber(cx), math.bignumber(cy), math.bignumber(theta), math.bignumber(maxY))), y: maxY};
		
		for (var key in rotatedExtrema) {
		    // skip loop if the property is from prototype
		    if (!rotatedExtrema.hasOwnProperty(key)) continue;

		    var rotatedExtremum = rotatedExtrema[key];

	        // angle of the rotated extremum
		    var phi = this.normalizeAngle(myShape.getAngle(rotatedExtremum) * (Math.PI/180));
		    // angle of rotation of the arc
		    var theta = this.normalizeAngle(alpha);
		    // normalized second angle for use in offset
		    var secondAngle = this.normalizeAngle(secondAngleBase);
		    // angle of normalized first angle, offset by secondAngle (second angle normalized to 0)
		    var firstAngle = this.normalizeAngle(firstAngleBase-secondAngleBase);
		    // angle of unrotated extremum, offset by secondAngle
		    var tau = this.normalizeAngle(phi-theta-secondAngle);

		    var strokeWidth = myShape.getStrokeWidth() / 2;
		    if (!flipArc) {
		    	if (tau >= 0 && tau <= firstAngle) {
					if (rotatedExtremum.x - strokeWidth < this.llx) {
						this.llx = rotatedExtremum.x - strokeWidth;
					}
					if (rotatedExtremum.x + strokeWidth > this.urx) {
						this.urx = rotatedExtremum.x + strokeWidth;
					}
					if ((this.canvasHeightInPixels - rotatedExtremum.y - strokeWidth) < this.lly) {
						this.lly = this.canvasHeightInPixels - rotatedExtremum.y - strokeWidth;
					}
					if ((this.canvasHeightInPixels - rotatedExtremum.y + strokeWidth) > this.ury) {
						this.ury = this.canvasHeightInPixels - rotatedExtremum.y + strokeWidth;
					}
		    	} else {

		    		if (firstEndPointExtremum.x < this.llx) {
		    			this.llx = firstEndPointExtremum.x;
		    		}
		    		if (firstEndPointExtremum.x > this.urx) {
		    			this.urx = firstEndPointExtremum.x;
		    		}
		    		if (this.canvasHeightInPixels - firstEndPointExtremum.y < this.lly) {
		    			this.lly = this.canvasHeightInPixels - firstEndPointExtremum.y;
		    		}
		    		if (this.canvasHeightInPixels - firstEndPointExtremum.y > this.ury) {
		    			this.ury = this.canvasHeightInPixels - firstEndPointExtremum.y;
		    		}

		    		if (secondEndPointExtremum.x < this.llx) {
		    			this.llx = secondEndPointExtremum.x;
		    		}
		    		if (secondEndPointExtremum.x > this.urx) {
		    			this.urx = secondEndPointExtremum.x;
		    		}
		    		if (this.canvasHeightInPixels - secondEndPointExtremum.y < this.lly) {
		    			this.lly = this.canvasHeightInPixels - secondEndPointExtremum.y;
		    		}
		    		if (this.canvasHeightInPixels - secondEndPointExtremum.y > this.ury) {
		    			this.ury = this.canvasHeightInPixels - secondEndPointExtremum.y;
		    		}
		    	}
		    } else {
		    	if (tau >= 0 && tau <= firstAngle) {

		    		if (firstEndPointExtremum.x < this.llx) {
		    			this.llx = firstEndPointExtremum.x;
		    		}
		    		if (firstEndPointExtremum.x < this.urx) {
		    			this.urx = firstEndPointExtremum.x;
		    		}
		    		if (this.canvasHeightInPixels - firstEndPointExtremum.y < this.lly) {
		    			this.lly = this.canvasHeightInPixels - firstEndPointExtremum.y;
		    		}
		    		if (this.canvasHeightInPixels - firstEndPointExtremum.y > this.ury) {
		    			this.ury = this.canvasHeightInPixels - firstEndPointExtremum.y;
		    		}

		    		if (secondEndPointExtremum.x < this.llx) {
		    			this.llx = secondEndPointExtremum.x;
		    		}
		    		if (secondEndPointExtremum.x < this.urx) {
		    			this.urx = secondEndPointExtremum.x;
		    		}
		    		if (this.canvasHeightInPixels - secondEndPointExtremum.y < this.lly) {
		    			this.lly = this.canvasHeightInPixels - secondEndPointExtremum.y;
		    		}
		    		if (this.canvasHeightInPixels - secondEndPointExtremum.y > this.ury) {
		    			this.ury = this.canvasHeightInPixels - secondEndPointExtremum.y;
		    		}
		    	} else {
		    		if (rotatedExtremum.x - strokeWidth < this.llx) {
						this.llx = rotatedExtremum.x - strokeWidth;
					}
					if (rotatedExtremum.x + strokeWidth > this.urx) {
						this.urx = rotatedExtremum.x + strokeWidth;
					}
					if ((this.canvasHeightInPixels - rotatedExtremum.y - strokeWidth) < this.lly) {
						this.lly = this.canvasHeightInPixels - rotatedExtremum.y - strokeWidth;
					}
					if ((this.canvasHeightInPixels - rotatedExtremum.y + strokeWidth) > this.ury) {
						this.ury = this.canvasHeightInPixels - rotatedExtremum.y + strokeWidth;
					}
		    	}
		    }
		}
	}
}

export default boundingBox;