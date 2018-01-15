import { transformPoint, decomposedMatrix, multiplyMatrices} from '../reducers/utilities/matrix';

class epsEllipse {

	constructor(ellipse) {
		this.ellipse = ellipse;
		this.produceEps = this.produceEps.bind(this);
		this.getCoords = this.getCoords.bind(this);
		this.rotateTransform = this.rotateTransform.bind(this);
	}

	produceEps(canvasHeight) {
		var m = JSON.parse(JSON.stringify(this.ellipse.transform[0].parameters));
		var m2 = multiplyMatrices(m, [1,0,0,1,0,canvasHeight]);
		// m = this.rotateTransform(m, -90, 0, 0);
		// m = multiplyMatrices([1,0,0,1,0,canvasHeight - (2 * this.ellipse.cy)], m);
		var tr = decomposedMatrix(this.ellipse.transform[0].parameters);
		console.log(tr.rotate);
		console.log(tr.skew);
		var cx = this.ellipse.cx;
		var cy = this.ellipse.cy;
		var rx = this.ellipse.rx;

		// var m0 = this.rectangle.transform[0].parameters[0];
		// var m1 = this.rectangle.transform[0].parameters[1];
		// var m2 = this.rectangle.transform[0].parameters[2];
		// var m3 = this.rectangle.transform[0].parameters[3];

		var str = this.ellipse.fill;
		var rawRGB = str.substring(5, str.length-1);
		var array = rawRGB.split(',');

		var r = parseInt(array[0], 10)/255;
		var g = parseInt(array[1], 10)/255;
		var b = parseInt(array[2], 10)/255;

		var drawingInfo = 
`${r} ${g} ${b} setrgbcolor
newpath
gsave
${tr.translate[0]} ${tr.translate[1]} translate
${tr.skew} rotate
${tr.scale[0]} ${tr.scale[1]} scale
${tr.rotate} rotate
${cx} ${cy} ${rx} 0 360 arc
closepath
fill
grestore
`;
		return drawingInfo;

	}

	getCoords() {
		const coords = {};
		coords[0] = transformPoint(this.rectangle.x, this.rectangle.y, this.rectangle.transform[0].parameters);
		coords[1] = transformPoint(this.rectangle.x + this.rectangle.width, this.rectangle.y, this.rectangle.transform[0].parameters);
		coords[2] = transformPoint(this.rectangle.x + this.rectangle.width, this.rectangle.y + this.rectangle.height, this.rectangle.transform[0].parameters);
		coords[3] = transformPoint(this.rectangle.x, this.rectangle.y + this.rectangle.height, this.rectangle.transform[0].parameters);
		return coords;
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