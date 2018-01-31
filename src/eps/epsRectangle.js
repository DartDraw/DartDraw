class epsRectangle {

	constructor(rectangle) {
		this.rectangle = rectangle;
		this.produceEps = this.produceEps.bind(this);
	}

	produceEps(canvasHeight) {
		var x1 = this.rectangle.x;
		var y1 = canvasHeight - this.rectangle.y;
		var x2 = this.rectangle.x + this.rectangle.width;
		var y2 = canvasHeight - (this.rectangle.y + this.rectangle.height);

		var str = this.rectangle.fill;
		var rawRGB = str.substring(5, str.length-1);
		var array = rawRGB.split(',');

		var r = parseInt(array[0], 10)/255;
		var g = parseInt(array[1], 10)/255;
		var b = parseInt(array[2], 10)/255;

		var drawingInfo = 
`${r} ${g} ${b} setrgbcolor
newpath
${x1} ${y1} moveto
${x2} ${y1} lineto
${x2} ${y2} lineto
${x1} ${y2} lineto
${x1} ${y1} lineto
closepath
fill
`;

	return drawingInfo;

	}
}


export default epsRectangle;