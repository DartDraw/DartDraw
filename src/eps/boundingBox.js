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
		this.updateBoundsRectangleHelper = this.updateBoundsRectangleHelper.bind(this);
		this.updateBoundsLine = this.updateBoundsLine.bind(this);
		this.updateBoundsRectangleHelper = this.updateBoundsRectangleHelper.bind(this);
		this.updateBoundsEllipseHelper = this.updateBoundsEllipseHelper.bind(this);
		this.updateBoundsPolygonHelper = this.updateBoundsPolygonHelper.bind(this);
		this.updateBoundsBezierHelper = this.updateBoundsBezierHelper.bind(this);
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
			console.log("diff is sufficiently small");
			helperTerm = 0;
		} else {
			console.log("diff is too large");
		}

		var firstPotentialY = math.divide(math.add(math.multiply(math.bignumber(-1), secondCoefficient), helperTerm), math.multiply(math.bignumber(2), firstCoefficient));
		var secondPotentialY = math.divide(math.subtract(math.multiply(math.bignumber(-1), secondCoefficient), helperTerm), math.multiply(math.bignumber(2), firstCoefficient));

		console.log("\nprinting potential y coordinates for this arc / ellipse");
		console.log(math.number(firstPotentialY));
		console.log(math.number(secondPotentialY));
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
			console.log("diff is sufficiently small");
			helperTerm = 0;
		} else {
			console.log("diff is too large");
		}

		var firstPotentialX = math.divide(math.add(math.multiply(math.bignumber(-1), secondCoefficient), helperTerm), math.multiply(math.bignumber(2), firstCoefficient));
		var secondPotentialX = math.divide(math.subtract(math.multiply(math.bignumber(-1), secondCoefficient), helperTerm), math.multiply(math.bignumber(2), firstCoefficient));

		console.log("\nprinting potential x coordinates for this arc / ellipse");
		console.log(math.number(firstPotentialX));
		console.log(math.number(secondPotentialX));
		return firstPotentialX;
	}

	updateBoundsIfNecessary(shape) {
		var str;
		if (shape.type == 'text') {
			str = shape.fill;
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
				this.updateBoundsRectangleHelper(shape);
				break;
			case "line":
				this.updateBoundsLine(shape);
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
			default:
				break;
		}
	}

	updateBoundsBezierHelper(shape) {
		const myShape = new epsShape(shape);
		const coords = myShape.getCoords();
		const controlPoints = myShape.getControlPoints();
		const strokeWidth = myShape.getStrokeWidth()/2;
		console.log("logging strokeWidth");
		const numPoints = myShape.getParams().numPoints;

		console.log("logging coords, controlPoints, strokeWidth, numPoints");

		if (!coords.hasOwnProperty(0)) {
			return;
		}

		for (var i = 0; i < numPoints-1; i = i + 1) {
		    let coord1 = coords[i];
		    let controlPointOne;
		    let controlPointTwo;
		    let coord2;
		    let index;
		    console.log("logging i");
		    console.log(i);

		    if (i == 0) {
		    	index = controlPoints.length-1;
		    	controlPointOne = controlPoints[index][1];
		    } else {
		    	controlPointOne = controlPoints[i-1][1];
		    }
	    	controlPointTwo = controlPoints[i][0];
	    	coord2 = coords[i+1];
	    	console.log("logging coord1, controlPointOne, controlPointTwo, coord2");
	    	console.log(coord1);
	    	console.log(controlPointOne);
	    	console.log(controlPointTwo);
	    	console.log(coord2);

		    // first check endpoints
		    if (coord1.x  - strokeWidth < this.llx) {
				this.llx = coord1.x - strokeWidth;
			}
			if (coord1.x + strokeWidth > this.urx) {
				this.urx = coord1.x + strokeWidth;
			}
			if ((this.canvasHeightInPixels - coord1.y - strokeWidth) < this.lly) {
				this.lly = this.canvasHeightInPixels - coord1.y - strokeWidth;
			}
			if ((this.canvasHeightInPixels - coord1.y + strokeWidth) > this.ury) {
				this.ury = this.canvasHeightInPixels - coord1.y + strokeWidth;
			}

		    // x extrema
		    let v1 = math.multiply(math.bignumber(3),math.subtract(math.bignumber(controlPointTwo.x),math.bignumber(controlPointOne.x)));
		    let v2 = math.multiply(math.bignumber(3),math.subtract(math.bignumber(coord2.x),math.bignumber(controlPointTwo.x)));
		    let v3 = math.multiply(math.bignumber(3),math.subtract(math.bignumber(controlPointTwo.x),math.bignumber(controlPointOne.x)));

		    let a = math.subtract(math.add(v1,v3),math.multiply(math.bignumber(2),v2));
		    let b = math.multiply(math.bignumber(2), math.subtract(v2,v1));
		    let c = v1;

		    if ( math.smaller( math.subtract (math.pow(b,math.bignumber(2)),math.multiply(math.bignumber(4),a,c) ),0) ) {
		    	console.log("b^2 - 4ac is less than 0");
		    	continue;
		    }

			let helperTerm = math.sqrt(math.subtract(math.pow(b,math.bignumber(2)), math.multiply(math.bignumber(4),a,c)));

			let firstPotentialT = math.divide(math.add(math.multiply(math.bignumber(-1),b), helperTerm), math.multiply(math.bignumber(2),a));
			let secondPotentialT = math.divide(math.subtract(math.multiply(math.bignumber(-1),b), helperTerm), math.multiply(math.bignumber(2),a));
			
			console.log("logging firstPotentialT, secondPotentialT for x");
			console.log(math.number(firstPotentialT));
			console.log(math.number(secondPotentialT));

			// make sure a value of t lies between 0 and 1
			let tExtremum = firstPotentialT;
			if (math.smaller(tExtremum,0) || math.larger(tExtremum,1)) {
				if (math.smaller(secondPotentialT,0) || math.larger(secondPotentialT,1)) {
					continue;
				} else {
					tExtremum = secondPotentialT;
				}
			}

			// plug value of t back into the equation
			let x = math.add(math.multiply(math.pow(math.subtract(math.bignumber(1),tExtremum),math.bignumber(3)),math.bignumber(coord1.x)),math.multiply(math.bignumber(3),math.pow(math.subtract(math.bignumber(1),tExtremum),math.bignumber(2)),tExtremum,math.bignumber(controlPointOne.x)),math.multiply(math.bignumber(3),math.subtract(math.bignumber(1),tExtremum),math.pow(tExtremum,math.bignumber(2)),math.bignumber(controlPointTwo.x)),math.multiply(math.pow(tExtremum,math.bignumber(3)),math.bignumber(coord2.x)));

			// // y extrema
		 //    a = math.add(math.subtract(math.multiply(3,math.subtract(controlPointOne.y, coord1.y)), math.subtract(controlPointTwo.y, controlPointOne.y)), math.multiply(3, math.subtract(coord2.y, controlPointTwo.y)));
		 //    b = math.multiply(6,math.subtract(math.subtract(controlPointTwo.y, controlPointOne.y), math.subtract(controlPointOne.y, coord1.y)));
			// c = math.multiply(3, math.subtract(controlPointOne.y, coord1.y));

			// helperTerm = math.sqrt(math.subtract(math.pow(b,2), math.multiply(4,a,c)));

			// firstPotentialT = math.divide(math.add(math.multiply(-1,b), helperTerm), math.multiply(2,a));
			// secondPotentialT = math.divide(math.subtract(math.multiply(-1,b), helperTerm), math.multiply(2,a));
			
			// console.log("logging firstPotentialT, secondPotentialT for y");
			// console.log(firstPotentialT);
			// console.log(secondPotentialT);

			// // plug appropriate value of t back into equation

			// // make sure a value of t lies between 0 and 1
			// tExtremum = firstPotentialT;
			// if (tExtremum < 0 || tExtremum > 1) {
			// 	if (secondPotentialT < 0 || secondPotentialT > 1) {
			// 		return;
			// 	} else {
			// 		tExtremum = secondPotentialT;
			// 	}
			// }
			// let y = math.add(math.multiply(math.pow(math.subtract(1,tExtremum),3),coord1.y),math.multiply(3,math.pow(math.subtract(1,tExtremum),2),tExtremum,controlPointOne.y),math.multiply(3,math.subtract(1,tExtremum),math.pow(tExtremum,2),controlPointTwo.y),math.multiply(math.pow(tExtremum,3),coord2.y));

			// now check extrema
		    if (x  - strokeWidth < this.llx) {
				this.llx = x - strokeWidth;
			}
			if (x + strokeWidth > this.urx) {
				this.urx = x + strokeWidth;
			}
			// if ((this.canvasHeightInPixels - y - strokeWidth) < this.lly) {
			// 	this.lly = this.canvasHeightInPixels - y - strokeWidth;
			// }
			// if ((this.canvasHeightInPixels - y + strokeWidth) > this.ury) {
			// 	this.ury = this.canvasHeightInPixels - y + strokeWidth;
			// }

			console.log("printing x for bezier curve");
			console.log(math.number(x));
			// console.log(y);
		}
		return;
	}


	updateBoundsRectangleHelper(point1, point2, strokeWidth) {
		var halfStrokeWidth = math.divide(math.bignumber(strokeWidth),2);
		var baseAdjacent = math.subtract(math.bignumber(point2.x), math.bignumber(point1.x));
		var baseOpposite = math.subtract(math.bignumber(point2.y), math.bignumber(point1.y));
		var lineAngle = math.atan2(baseOpposite, baseAdjacent);
		var angle = math.subtract(math.divide(math.pi,4),lineAngle);

		var smallHypotenuseLength = math.multiply(math.sqrt(math.bignumber(2)),halfStrokeWidth);
		var smallHypotenuseAngle = math.subtract(lineAngle,math.divide(math.pi,4));

		var adjacent = math.abs(math.multiply(math.cos(smallHypotenuseAngle),smallHypotenuseLength));
		var opposite = math.abs(math.multiply(math.sin(smallHypotenuseAngle),smallHypotenuseLength));
		console.log("logging adjacent and opposite");
		console.log(math.number(adjacent));
		console.log(math.number(opposite));
		

		// compute boundaries of one end of the line
		if (math.smaller(math.subtract(math.bignumber(point1.x),adjacent),math.bignumber(this.llx))) {
			this.llx = math.number(math.subtract(math.bignumber(point1.x),adjacent));
		}

		if (math.smaller(math.subtract(this.canvasHeightInPixels,math.add(math.bignumber(point1.y),opposite)),math.bignumber(this.lly))) {
			this.lly = math.number(math.subtract(this.canvasHeightInPixels,math.add(math.bignumber(point1.y),opposite)));
		}

		if (math.larger(math.add(math.bignumber(point2.x),adjacent),math.bignumber(this.urx))) {
			this.urx = math.number(math.add(math.bignumber(point2.x),adjacent));
		}

		if (math.larger(math.subtract(this.canvasHeightInPixels,math.subtract(math.bignumber(point2.y),opposite)),math.bignumber(this.ury))) {
			this.ury = math.number(math.subtract(this.canvasHeightInPixels,math.subtract(math.bignumber(point2.y),opposite)));
		}
	}

	updateBoundsLine(shape) {
		return;
		var myShape = new epsShape(shape);
		var coords = myShape.getCoords();
		var strokeWidth = myShape.getStrokeWidth();

		this.updateBoundsLineHelper(coords[0], coords[1], strokeWidth);
	}

	updateBoundsEllipseHelper(shape) {
		var myShape = new epsShape(shape);
		var params = myShape.getParams();
		var cx = params.cx;
		var cy = params.cy;
		var rx = params.rx;
		var ry = params.ry;
		var alpha = params.alpha * (Math.PI/180);
		console.log(alpha);

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
			console.log("updating llx");
			this.llx = minX - strokeWidth;
		}
		if (maxX + strokeWidth > this.urx) {
			console.log("updating urx");
			this.urx = maxX + strokeWidth;
		}
		if ((this.canvasHeightInPixels - maxY - strokeWidth) < this.lly) {
			console.log("updating lly");
			this.lly = this.canvasHeightInPixels - maxY - strokeWidth;
		}
		if ((this.canvasHeightInPixels - minY + strokeWidth) > this.ury) {
			console.log("updating ury");
			this.ury = this.canvasHeightInPixels - minY + strokeWidth;
		}
	}

	updateBoundsPolygonHelper(shape) {
		var myShape = new epsShape(shape);
		var coords = myShape.getCoords();
		var halfStrokeWidth = math.divide(myShape.getStrokeWidth(),math.bignumber(2));

		for (var i=0; i < coords.length-1; i++) {
			// we need three points to determine angles
			let index = i;
			let secondIndex = i+1;
			let thirdIndex = i+2;

			// wrap around
			if (index == coords.length-3) {
				thirdIndex = 0;
			}
			if (index == coords.length-2) {
				secondIndex = 0;
				thirdIndex = 1;
			}

			let pointOne = coords[index];
			let pointTwo = coords[secondIndex];
			let pointThree = coords[thirdIndex];

			// this is all to get the angle between the two vectors
			// first we get the length of the vectors
			let vectorOneLength = math.sqrt(math.add(math.pow(math.subtract(math.bignumber(pointOne.x),math.bignumber(pointTwo.x)),math.bignumber(2)),math.pow(math.subtract(math.bignumber(pointOne.y),math.bignumber(pointTwo.y)),math.bignumber(2))));
			let vectorTwoLength = math.sqrt(math.add(math.pow(math.subtract(math.bignumber(pointTwo.x),math.bignumber(pointThree.x)),math.bignumber(2)),math.pow(math.subtract(math.bignumber(pointTwo.y),math.bignumber(pointThree.y)),math.bignumber(2))));
			// then we normalize the vectors (both originating at pointTwo)
			let vectorOne = [math.divide(math.subtract(math.bignumber(pointOne.x),math.bignumber(pointTwo.x)),vectorOneLength), math.divide(math.subtract(math.bignumber(pointOne.y),math.bignumber(pointTwo.y)),vectorOneLength)];
			let vectorTwo = [math.divide(math.subtract(math.bignumber(pointThree.x),math.bignumber(pointTwo.x)),vectorTwoLength), math.divide(math.subtract(math.bignumber(pointThree.y),math.bignumber(pointTwo.y)),vectorTwoLength)];
			// and get the angle between the vectors
			let cosAngle = math.add(math.multiply(vectorOne[0],vectorTwo[0]),math.multiply(vectorOne[1],vectorTwo[1]));
			let angle = math.acos(cosAngle);

			// this is gathering other data we need
			let middleLineLength = math.divide(halfStrokeWidth,math.sin(math.divide(angle,math.bignumber(2))));
			let theta = math.asec(vectorOneLength);
			// check to make sure the angle isn't pi/2
			if (undefined === theta) {
				theta = math.divide(math.pi,math.bignumber(2));
			}

			// now we get the values to check
			let phi = math.subtract(theta,math.divide(angle,math.bignumber(2)));
			let horizontal = math.abs(math.multiply(middleLineLength,math.sin(phi)));
			let vertical = math.abs(math.multiply(middleLineLength,math.cos(phi)));


			if (math.smaller(math.subtract(math.bignumber(pointTwo.x),horizontal),math.bignumber(this.llx))) {
				this.llx = math.number(math.subtract(math.bignumber(pointTwo.x),horizontal));
			}
			if (math.smaller(math.subtract(this.canvasHeightInPixels,math.add(math.bignumber(pointTwo.y),vertical)),math.bignumber(this.lly))) {
				this.lly = math.number(math.subtract(this.canvasHeightInPixels,math.add(math.bignumber(pointTwo.y),vertical)));
			}
			if (math.larger(math.add(math.bignumber(pointTwo.x),horizontal),math.bignumber(this.urx))) {
				this.urx = math.number(math.add(math.bignumber(pointTwo.x),horizontal));
			}
			if (math.larger(math.subtract(this.canvasHeightInPixels,math.subtract(math.bignumber(pointTwo.y),vertical)),math.bignumber(this.ury))) {
				this.ury = math.number(math.subtract(this.canvasHeightInPixels,math.subtract(math.bignumber(pointTwo.y),vertical)));
			}
		}

		// for (var key in coords) {
		//     // skip loop if the property is from prototype
		//     if (!coords.hasOwnProperty(key)) continue;

		//     var coord = coords[key];

		//     if (coord.x < this.llx) {
		// 		this.llx = coord.x;
		// 	}
		// 	if ((coord.x) > this.urx) {
		// 		this.urx = coord.x;
		// 	}
		// 	if ((this.canvasHeightInPixels - coord.y) < this.lly) {
		// 		this.lly = this.canvasHeightInPixels - coord.y;
		// 	}
		// 	if ((this.canvasHeightInPixels - coord.y) > this.ury) {
		// 		this.ury = this.canvasHeightInPixels - coord.y;
		// 	}
		// }
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
		    		console.log("extremum lies within angle range");
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
		    		console.log("extremum does not lie within angle range");

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
		    		console.log("extremum does not lie within angle range");

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
		    		console.log("extremum lies within angle range");
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