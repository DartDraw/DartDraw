import { transformPoint } from '../reducers/utilities/matrix';
var math = window.require('mathjs');
math.config({
  number: 'BigNumber', // Default type of number:
                       // 'number' (default), 'BigNumber', or 'Fraction'
  precision: 128        // Number of significant digits for BigNumbers
});

class epsText {

	constructor(text) {
		this.text = text;
		this.produceEps = this.produceEps.bind(this);
		this.getCoords = this.getCoords.bind(this);
		this.getRotate = this.getRotate.bind(this);
		this.getDrawing = this.getDrawing.bind(this);
		var text = this.text.text;
		console.log("logging text");
		console.log(text);
		var textLine;
		var index;
		const textArray = [];
		while ((index = text.indexOf("\n")) != -1) {
			var textLine = text.substring(0,index);
			textArray.push(textLine);
			text = text.substring(index+1, text.length);
		}
		textArray.push(text);

		this.textArray = textArray;
	}

	produceEps(canvasHeightInPixels) {
		const coords = this.getCoords();
		var rotateAngle = this.getRotate();
		console.log("logging angle");
		console.log(math.number(math.multiply(math.pi,math.divide(math.bignumber(rotateAngle),math.bignumber(180)))));
		// var tempAngle = math.subtract(math.divide(math.pi,2),math.multiply(math.pi,math.divide(math.bignumber(rotateAngle),math.bignumber(180))));
		// console.log(math.number(tempAngle));
		// var vectorLength = math.sqrt(math.add(math.pow(math.bignumber(coords[0].x),2),math.pow(math.bignumber(coords[0].y),2)));
		// var xDiff = math.multiply(vectorLength,math.cos(tempAngle));
		// var yDiff = math.multiply(vectorLength,math.sin(tempAngle));

		// var x, y;
		// if (coords[1].x - coords[0].x <k 0) {
		// 	x = coords[0].x + math.number(xDiff);
		// 	y = coords[0].y - math.number(yDiff);
		// } else {
		// 	x = coords[0].x - math.number(xDiff);
		// 	y = coords[0].y + math.number(yDiff);
		// }

		var x = coords[0].x;
		var y = canvasHeightInPixels - coords[0].y;

		var fillStr = this.text.fill;
		var fillRawRGB = fillStr.substring(5, fillStr.length-1);
		var fillArray = fillRawRGB.split(',');

		var fillR = parseInt(fillArray[0], 10)/255;
		var fillG = parseInt(fillArray[1], 10)/255;
		var fillB = parseInt(fillArray[2], 10)/255;

		var font;
		var fontFamily = this.text.fontFamily;
		var weight = this.text.weight;
		var style = this.text.style;
		switch(fontFamily) {
			case "Helvetica":
				if (weight === "lighter") {
					if (style === "italic" || style === "oblique") {
						font = "Helvetica-LightOblique";
					} else {
						font = "Helvetica-Light";
					}
				} else if (weight === "bold") {
					if (style === "italic" || style === "oblique") {
						font = "Helvetica-BoldOblique";
					} else {
						font = "Helvetica-Bold";
					}
				} else {
					if (style === "italic" || style === "oblique") {
						font = "Helvetica-Oblique";
					} else {
						font = "Helvetica";
					}
				}
				break;
			case "Arial":
				if (weight === "lighter") {
					if (style === "italic" || style === "oblique") {
						font = "ArialNarrow-Italic";
					} else {
						font = "ArialMT";
					}
				} else if (weight === "bold") {
					if (style === "italic" || style === "oblique") {
						font = "ArialNarrow-BoldItalic";
					} else {
						font = "ArialNarrow-Bold";
					}
				} else {
					if (style === "italic" || style === "oblique") {
						font = "ArialNarrow-Italic";
					} else {
						font = "ArialMT";
					}
				}
				break;
			case "Times":
				if (weight === "bold") {
					if (style === "italic" || style === "oblique") {
						font = "Times-BoldItalic";
					} else {
						font = "Times-Bold";
					}
				} else {
					if (style === "italic" || style === "oblique") {
						font = "Times-Italic";
					} else {
						font = "Times";
					}
				}
				break;
			case "Times New Roman":
				if (weight === "bold") {
					if (style === "italic" || style === "oblique") {
						font = "TimesNewRomanPS-BoldItalicMT";
					} else {
						font = "TimesNewRomanPS-BoldMT";
					}
				} else {
					if (style === "italic" || style === "oblique") {
						font = "TimesNewRomanPS-ItalicMT";
					} else {
						font = "Times-Roman";
					}
				}
				break;
			case "Courier":
				if (weight === "bold") {
					if (style === "italic" || style === "oblique") {
						font = "Courier-BoldOlbique";
					} else {
						font = "Courier-Bold";
					}
				} else {
					if (style === "italic" || style === "oblique") {
						font = "Courier-Oblique";
					} else {
						font = "Courier";
					}
				}
				break;
			case "Courier New":
				if (weight === "bold") {
					if (style === "italic" || style === "oblique") {
						font = "CourierNewPS-BoldItalicMT";
					} else {
						font = "CourierNewPS-BoldMT";
					}
				} else {
					if (style === "italic" || style === "oblique") {
						font = "CourierNewPS-ItalicMT";
					} else {
						font = "CourierNewPSMT";
					}
				}
				break;
			case "Verdana":
				if (weight === "bold") {
					if (style === "italic" || style === "oblique") {
						font = "Verdana-BoldItalic";
					} else {
						font = "Verdana-Bold";
					}
				} else {
					if (style === "italic" || style === "oblique") {
						font = "Verdana-Italic";
					} else {
						font = "Verdana";
					}
				}
				break;
			case "Verdana":
				if (weight === "bold") {
					if (style === "italic" || style === "oblique") {
						font = "Georgia-BoldItalic";
					} else {
						font = "Georgia-Bold";
					}
				} else {
					if (style === "italic" || style === "oblique") {
						font = "Georgia-Italic";
					} else {
						font = "Georgia";
					}
				}
				break;
			case "Garamond":
				if (weight === "bold") {
					font = "Garamond-Bold";
				} else {
					if (style === "italic" || style === "oblique") {
						font = "Garamond-Italic";
					} else {
						font = "Garamond";
					}
				}
				break;
			case "Comic Sans":
				if (weight === "bold") {
					font = "ComicSansMS-Bold";
				} else {
					font = "ComicSansMS";
				}
				break;
			default:
				font = "Helvetica";
		}

		var text = this.text.text;
		var fontFamily = this.text.fontFamily;
		var fontSize = this.text.fontSize;
		var drawing = this.getDrawing();
		console.log("logging the drawing");
		console.log(drawing);
		var lineHeight = parseInt(this.text.lineHeight) * -1;

		var drawingInfo = 
`/${fontFamily} findfont
${fontSize} scalefont
setfont
${fillR} ${fillG} ${fillB} setrgbcolor
gsave
${x} ${y} translate
${rotateAngle} rotate
0 ${lineHeight} moveto
${drawing}
grestore
`;

		return drawingInfo;

	}

	getCoords() {
		var height = parseInt(this.text.lineHeight) * (this.textArray.length-1) + this.text.height;
		const coords = [];
		coords.push(transformPoint(this.text.x, this.text.y, this.text.transform[0].parameters));
		coords.push(transformPoint(this.text.x + this.text.width, this.text.y, this.text.transform[0].parameters));
		coords.push(transformPoint(this.text.x + this.text.width, this.text.y + height, this.text.transform[0].parameters));
		coords.push(transformPoint(this.text.x, this.text.y + height, this.text.transform[0].parameters));
		return coords;
	}

	getRotate() {
		const coords = this.getCoords();
		var xDiff = coords[1].x - coords[0].x;
		var yDiff = coords[1].y - coords[0].y;
		var lineAngle = math.number(math.atan2(yDiff, xDiff));
		lineAngle = lineAngle * -1;

		return (lineAngle * 180) / math.number(math.pi);
	}

	getDrawing() {
		console.log("logging length of the text array");
		console.log(this.textArray.length);
		var lineHeight = "-" + this.text.lineHeight;
		var textString = "newpath\n";
		textString += "(" + this.textArray[0] + ") show\n";
		let offset;
		for (var i = 1; i < this.textArray.length; i++) {
			console.log("updating textString");
			offset = (i+1) * parseInt(lineHeight);
			textString += "newpath\n";
			textString += "0 " + offset.toString() + " moveto\n";
			textString += "(" + this.textArray[i] + ") show\n";
			console.log("this is what textString was updated to");
			console.log(textString);
		}
		return textString;
	}
}


export default epsText;