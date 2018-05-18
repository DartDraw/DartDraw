import { transformPoint } from '../reducers/utilities/matrix';

class epsText {

	constructor(text) {
		this.text = text;
		console.log(text);
		this.produceEps = this.produceEps.bind(this);
	}

	produceEps(canvasHeightInPixels) {
		var x = this.text.x;
		var y = canvasHeightInPixels - this.text.y;

		var fillStr = this.text.fill;
		var fillRawRGB = fillStr.substring(5, fillStr.length-1);
		var fillArray = fillRawRGB.split(',');

		var fillR = parseInt(fillArray[0], 10)/255;
		var fillG = parseInt(fillArray[1], 10)/255;
		var fillB = parseInt(fillArray[2], 10)/255;

		var fontFamily = this.text.fontFamily;
		var fontSize = this.text.fontSize;

		var text = this.text.text;

		var drawingInfo = 
`/${fontFamily} findfont
${fontSize} scalefont
setfont
newpath
${fillR} ${fillG} ${fillB} setrgbcolor
${x} ${y} moveto
(${text}) show
`;

		return drawingInfo;

	}
}


export default epsText;