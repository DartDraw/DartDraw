import { transformPoint, decomposedMatrix, multiplyMatrices} from '../reducers/utilities/matrix';

class epsEllipse {

	constructor(ellipse) {
		this.ellipse = ellipse;
		this.produceEps = this.produceEps.bind(this);
		this.getCoords = this.getCoords.bind(this);
		this.getRadii - this.getRadii.bind(this);
		this.getRotate = this.getRotate.bind(this);
		this.getParams = this.getParams.bind(this);
		this.rotateTransform = this.rotateTransform.bind(this);
	}

	produceEps(canvasHeightInPixels) {
		var coords = this.getCoords();

		var cx = coords[0].x;
		var cy = canvasHeightInPixels - coords[0].y;

		var radii = this.getRadii(coords[0], coords[1], coords[2]);
		var rx = radii.rx;
		var ry = radii.ry;

		var angle = this.getRotate(coords[0], coords[2]);

		var fillStr = this.ellipse.fill;
		var fillRawRGB = fillStr.substring(5, fillStr.length-1);
		var fillArray = fillRawRGB.split(',');

		var fillR = parseInt(fillArray[0], 10)/255;
		var fillG = parseInt(fillArray[1], 10)/255;
		var fillB = parseInt(fillArray[2], 10)/255;

		var strokeStr = this.ellipse.stroke;
		var strokeRawRGB = strokeStr.substring(5, strokeStr.length-1);
		var strokeArray = strokeRawRGB.split(',');

		var strokeR = parseInt(strokeArray[0], 10)/255;
		var strokeG = parseInt(strokeArray[1], 10)/255;
		var strokeB = parseInt(strokeArray[2], 10)/255;

		var strokeWidth = this.ellipse.strokeWidth;

		var drawingInfo = 
`/ellipse {7 dict begin
	/angle exch def
	/yradius exch def
	/xradius exch def
	/yC exch def
	/xC exch def
	/savematrix matrix currentmatrix def
	xC yC translate
	angle rotate
	xradius yradius scale
	0 0 1 0 360 arc
	savematrix setmatrix
end
} def

${fillR} ${fillG} ${fillB} setrgbcolor
newpath
${cx} ${cy} ${rx} ${ry} ${angle} ellipse fill
1 setlinewidth
${strokeR} ${strokeG} ${strokeB} setrgbcolor
newpath
${cx} ${cy} ${rx} ${ry} ${angle} ellipse stroke
`;
		return drawingInfo;

	}

	getCoords() {
		const coords = {};
		coords[0] = transformPoint(this.ellipse.cx, this.ellipse.cy, this.ellipse.transform[0].parameters);
		coords[1] = transformPoint(this.ellipse.cx + this.ellipse.rx, this.ellipse.cy, this.ellipse.transform[0].parameters);
		coords[2] = transformPoint(this.ellipse.cx, this.ellipse.cy + this.ellipse.ry, this.ellipse.transform[0].parameters);
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

	getRotate(center, secondEdge) {
		//vectorize
		var vector = [secondEdge.x - center.x, secondEdge.y - center.y];
		var ry = Math.sqrt( (secondEdge.x - center.x)**2 + (secondEdge.y - center.y) ** 2);
		var axis = [0, ry];

		//solve
		var cosAngle = (vector[1] * ry)/(ry**2);

		//arcos
		var test = Math.acos(cosAngle) * (180/Math.PI);
		console.log(test);
		return test;
	}

	getParams(center, firstEdge, secondEdge) {
		var coords = this.getCoords();
		var params = this.getRadii(coords[0], coords[1], coords[2]);

		return {
			cx: coords[0].x,
			cy: coords[0].y,
			rx: params.rx,
			ry: params.ry,
			alpha: this.getRotate(coords[0], coords[2])
		};
	}

	rotateTransform(transform1, a, cx, cy) {
	    // https://stackoverflow.com/questions/15133977/how-to-calculate-svg-transform-matrix-from-rotate-translate-scale-values
	    let transform2 = [Math.cos(a),
	        Math.sin(a),
	        -Math.sin(a),
	        Math.cos(a),
	        -cx * Math.cos(a) + cy * Math.sin(a) + cx,
	        -cx * Math.sin(a) - cy * Math.cos(a) + cy];
	    return multiplyMatrices(transform2, transform1);
	}
}


export default epsEllipse;