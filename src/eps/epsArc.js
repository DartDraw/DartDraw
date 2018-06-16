import { transformPoint, decomposedMatrix, multiplyMatrices} from '../reducers/utilities/matrix';

class epsArc {

	constructor(arc) {
		this.arc = arc;
		this.produceEps = this.produceEps.bind(this);
		this.getCoords = this.getCoords.bind(this);
		this.getRotate = this.getRotate.bind(this);
		this.getParams = this.getParams.bind(this);
		this.getAngle = this.getAngle.bind(this);
		this.getRotatedAngles = this.getRotatedAngles.bind(this);
		this.getRotatedEndPoints = this.getRotatedEndPoints.bind(this);
		this.getRotatedEndPointExtremum = this.getRotatedEndPointExtremum.bind(this);
		this.getTransform = this.getTransform.bind(this);
	}

	produceEps(canvasHeightInPixels) {
		var coords = this.getCoords();

		var cx = coords[0].x;
		var cy = canvasHeightInPixels - coords[0].y;

		var radii = this.getRadii(coords[0], coords[1], coords[2]);
		var rx = radii.rx;
		var ry = radii.ry;

		var altCoords = {};
		altCoords[0] = {x: this.arc.points[0], y: this.arc.points[1]};
		altCoords[1] = {x: this.arc.points[2], y: this.arc.points[3]};
		var firstAngle = this.getAngle(altCoords[0]);
		var secondAngle = this.getAngle(altCoords[1]);

		var rotateAngle = this.getRotate();

		var strokeStr = this.arc.stroke;
		var strokeRawRGB = strokeStr.substring(5, strokeStr.length-1);
		var strokeArray = strokeRawRGB.split(',');

		var strokeR = parseInt(strokeArray[0], 10)/255;
		var strokeG = parseInt(strokeArray[1], 10)/255;
		var strokeB = parseInt(strokeArray[2], 10)/255;

		var strokeWidth = this.arc.strokeWidth;
		var arcDirection = "arc";

		if (this.arc.flipArc) {
			arcDirection = "arcn";
		}

		var drawingInfo = 
`/myarc {8 dict begin
	/rotateAngle exch def
	/secondAngle exch def
	/firstAngle exch def
	/yradius exch def
	/xradius exch def
	/yC exch def
	/xC exch def
	/savematrix matrix currentmatrix def
	xC yC translate
	rotateAngle rotate
	xradius yradius scale
	0 0 1 secondAngle firstAngle ${arcDirection}
	savematrix setmatrix
end
} def

${strokeWidth} setlinewidth
${strokeR} ${strokeG} ${strokeB} setrgbcolor
newpath
${cx} ${cy} ${rx} ${ry} ${firstAngle} ${secondAngle} ${rotateAngle} myarc stroke
`;
		return drawingInfo;

	}

	getCoords() {
		const coords = {};
		coords[0] = transformPoint(this.arc.center.x, this.arc.center.y, this.arc.transform[0].parameters);
		coords[1] = transformPoint(this.arc.center.x + Math.abs(this.arc.rx), this.arc.center.y, this.arc.transform[0].parameters);
		coords[2] = transformPoint(this.arc.center.x, this.arc.center.y + Math.abs(this.arc.ry), this.arc.transform[0].parameters);
		return coords;
	}

	getRadii(center, firstEdge, secondEdge) {
		var rx = Math.sqrt( (firstEdge.x - center.x)**2 + (firstEdge.y - center.y) ** 2);
		var ry = Math.sqrt( (secondEdge.x - center.x)**2 + (secondEdge.y - center.y) ** 2);
		return {
			rx: rx,
			ry: ry
		};
	}

	getAngle(point) {
		var rx = Math.abs(this.arc.rx);
		var center = this.arc.center;
		//vectorize
		var vector = [point.x - center.x, point.y - center.y];
		var vectorLength = Math.sqrt( vector[0]**2 + vector[1]**2 );

		//solve
		var cosAngle = (vector[0] * rx) / (rx * vectorLength);
		//arcos
		var angle = Math.acos(cosAngle) * (180/Math.PI);
		if (vector[1] > 0) {
			angle = angle * -1;
		}

		return angle;
	}

	getRotatedEndPoints() {
		const rotatedEndPoints = {};
		rotatedEndPoints[0] = transformPoint(this.arc.points[0], this.arc.points[1], this.arc.transform[0].parameters);
		rotatedEndPoints[1] = transformPoint(this.arc.points[2], this.arc.points[3], this.arc.transform[0].parameters);
		return rotatedEndPoints;
	}

	getRotatedAngles() {
		const rotatedAngles = {};
		const rotatedEndPoints = this.getRotatedEndPoints();
		rotatedAngles[0] = this.getAngle({x: rotatedEndPoints[0].x, y: rotatedEndPoints[0].y});
		rotatedAngles[1] = this.getAngle({x: rotatedEndPoints[1].x, y: rotatedEndPoints[1].y});
		return rotatedAngles;
	}

	getRotatedEndPointExtremum(rotatedEndPoint, rotatedAngle) {
		var angle = rotatedAngle * (Math.PI/180);
		var hypotenuseLength = this.arc.strokeWidth / 2;
		var xLength = hypotenuseLength * Math.cos(angle);
		var yLength = hypotenuseLength * Math.sin(angle);
		
		var xExtremum = rotatedEndPoint.x + xLength;
		var yExtremum = rotatedEndPoint.y + yLength;

		return {x: xExtremum, y: yExtremum};
	}

	getRotate() {
		var coords = this.getCoords();
		var center = coords[0];
		var firstEdge = coords[2];
		//vectorize
		var vector = [firstEdge.x - center.x, firstEdge.y - center.y];
		var vectorLength = Math.sqrt( vector[0]**2 + vector[1]**2 );

		var ry = Math.sqrt( (firstEdge.x - center.x)**2 + (firstEdge.y - center.y) ** 2);

		//solve
		var cosAngle = (vector[1] * ry)/(ry**2);

		//arcos
		var angle = Math.acos(cosAngle) * (180/Math.PI);
		if (vector[0] < 0) {
			angle = angle * -1;
		}

		return angle;
	}

	getParams() {
		var coords = this.getCoords();
		var params = this.getRadii(coords[0], coords[1], coords[2]);
		var rotatedAngles = this.getRotatedAngles();
		var rotatedEndPoints = this.getRotatedEndPoints();
		return {
			center: this.arc.center,
			cx: coords[0].x,
			cy: coords[0].y,
			rx: params.rx,
			ry: params.ry,
			firstAngle: this.getAngle({x: this.arc.points[0], y: this.arc.points[1]}),
			secondAngle: this.getAngle({x: this.arc.points[2], y: this.arc.points[3]}),
			firstAngleRotated: rotatedAngles[0],
			secondAngleRotated: rotatedAngles[1],

			firstEndPointExtremum: this.getRotatedEndPointExtremum(rotatedEndPoints[0], rotatedAngles[0]),
			secondEndPointExtremum: this.getRotatedEndPointExtremum(rotatedEndPoints[1], rotatedAngles[1]),

			alpha: this.getRotate(coords[0], coords[2]),
			flipArc: this.arc.flipArc
		};
	}

	getTransform() {
		return this.arc.transform.parameters;
	}
}


export default epsArc;