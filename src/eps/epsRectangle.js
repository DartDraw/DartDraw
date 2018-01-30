import { transformPoint } from '../reducers/utilities/matrix';

class epsRectangle {

	constructor(rectangle) {
		this.rectangle = rectangle;
		this.produceEps = this.produceEps.bind(this);
		this.getCoords = this.getCoords.bind(this);
	}

	produceEps(canvasHeightInPixels) {
		var coords = this.getCoords();
		var x0 = coords[0].x;
		var y0 = canvasHeightInPixels - coords[0].y;
		var x1 = coords[1].x;
		var y1 = canvasHeightInPixels - coords[1].y;
		var x2 = coords[2].x;
		var y2 = canvasHeightInPixels - coords[2].y;
		var x3 = coords[3].x;
		var y3 = canvasHeightInPixels - coords[3].y;

		var str = this.rectangle.fill;
		var rawRGB = str.substring(5, str.length-1);
		var array = rawRGB.split(',');

		var r = parseInt(array[0], 10)/255;
		var g = parseInt(array[1], 10)/255;
		var b = parseInt(array[2], 10)/255;

		var drawingInfo = 
`${r} ${g} ${b} setrgbcolor
newpath
${x0} ${y0} moveto
${x1} ${y1} lineto
${x2} ${y2} lineto
${x3} ${y3} lineto
${x0} ${y0} lineto
closepath
fill

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
}


export default epsRectangle;