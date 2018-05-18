import { transformPoint } from '../reducers/utilities/matrix';

class epsLine {

	constructor(line) {
		this.line = line;
		this.produceEps = this.produceEps.bind(this);
		this.getCoords = this.getCoords.bind(this);
	}

	produceEps(canvasHeight) {
		var coords = this.getCoords();
		var x0 = coords[0].x;
		var y0 = canvasHeight - coords[0].y;
		var x1 = coords[1].x;
		var y1 = canvasHeight - coords[1].y;

		var str = this.line.stroke;
		var rawRGB = str.substring(5, str.length-1);
		var array = rawRGB.split(',');

		var r = parseInt(array[0], 10)/255;
		var g = parseInt(array[1], 10)/255;
		var b = parseInt(array[2], 10)/255;

		var strokeWidth = this.line.strokeWidth;

		var drawingInfo = 
`${r} ${g} ${b} setrgbcolor
${strokeWidth} setlinewidth
newpath
${x0} ${y0} moveto
${x1} ${y1} lineto
stroke
`;
		return drawingInfo;

	}

	getCoords() {
		const coords = [];
		coords.push(transformPoint(this.line.points[0], this.line.points[1], this.line.transform[0].parameters));
		coords.push(transformPoint(this.line.points[2], this.line.points[3], this.line.transform[0].parameters));
		return coords;
	}
}


export default epsLine;