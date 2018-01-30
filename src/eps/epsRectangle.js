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

		var fillStr = this.rectangle.fill;
		var fillRawRGB = fillStr.substring(5, fillStr.length-1);
		var fillArray = fillRawRGB.split(',');

		var fillR = parseInt(fillArray[0], 10)/255;
		var fillG = parseInt(fillArray[1], 10)/255;
		var fillB = parseInt(fillArray[2], 10)/255;

		var strokeStr = this.rectangle.stroke;
		var strokeRawRGB = strokeStr.substring(5, strokeStr.length-1);
		var strokeArray = strokeRawRGB.split(',');

		var strokeR = parseInt(strokeArray[0], 10)/255;
		var strokeG = parseInt(strokeArray[1], 10)/255;
		var strokeB = parseInt(strokeArray[2], 10)/255;

		var strokeWidth = this.rectangle.strokeWidth;

		var drawingInfo = 
`newpath
${x0} ${y0} moveto
${x1} ${y1} lineto
${x2} ${y2} lineto
${x3} ${y3} lineto
${x0} ${y0} lineto
closepath
${strokeR} ${strokeG} ${strokeB} setrgbcolor
1 setlinewidth
stroke
newpath
${x0} ${y0} moveto
${x1} ${y1} lineto
${x2} ${y2} lineto
${x3} ${y3} lineto
${x0} ${y0} lineto
closepath
${fillR} ${fillG} ${fillB} setrgbcolor
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