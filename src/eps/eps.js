import epsShape from './epsShape';
import epsLine from './epsLine';
import epsArrow from './epsArrow';
import boundingBox from './boundingBox';
import { deepCopy } from '../reducers/utilities/object'

export function generateEps(stateCopy) {
	console.log("attempting to log special character");
	console.log("test↵ing");
	console.log("\r");

	console.log("logging stateCopy");
	console.log(stateCopy);
	var drawing = '';
	var myBoundingBox = new boundingBox(stateCopy.canvasHeight, stateCopy.canvasWidth);

	for (var i = 0; i < stateCopy.shapes.allIds.length; i++) {
		var id = stateCopy.shapes.allIds[i];
		var shape = stateCopy.shapes.byId[id];
		var myShape;

		if (shape.type === "line") {
			let lineCopy = deepCopy(shape);
			let linePoints = shape.points;
			let arrowHead = stateCopy.shapes.arrows.byId[lineCopy.arrowHeadId];
			let arrowTail = stateCopy.shapes.arrows.byId[lineCopy.arrowTailId];

			if (shape.arrowHeadShown) {
				let arrowHeadShape = new epsArrow(arrowHead, true, linePoints);
				let data = arrowHeadShape.produceEps(stateCopy.canvasHeight);
				drawing = drawing + data.drawing;
				lineCopy.points[2] = data.endPoint.x;
				lineCopy.points[3] = data.endPoint.y;
				console.log(arrowHeadShape);
				myBoundingBox.updateBoundsIfNecessary(arrowHeadShape);
			}

			if (shape.arrowTailShown) {
				let arrowTailShape = new epsArrow(arrowTail, false, linePoints);
				let data = arrowTailShape.produceEps(stateCopy.canvasHeight);
				drawing = drawing + data.drawing;
				lineCopy.points[0] = data.endPoint.x;
				lineCopy.points[1] = data.endPoint.y;
				myBoundingBox.updateBoundsIfNecessary(arrowTailShape);
			}
			var myShape = new epsShape(lineCopy);
		} else {
			var myShape = new epsShape(shape);
		}

		drawing = drawing + myShape.produceEps(stateCopy.canvasHeight);
		myBoundingBox.updateBoundsIfNecessary(shape);
	}

	// for (var i = 0; i < stateCopy.shapes.arrows.allIds.length; i++) {
	// 	var arrowID = stateCopy.shapes.arrows.allIds[i];
	// 	var arrow = stateCopy.shapes.arrows.byId[id];

	// 	var myArrow = new epsShape(arrow);
	// 	console.log(myArrow);
	// 	drawing = drawing + myARrow.produceEps(stateCopy.canvasHeight);
	// 	myBoundingBox.updateBoundsIfNecessary(shape);
	// }

	var epsTemplate = 
`%!PS-Adobe-3.0 EPSF-3.0
%%Creator: Adobe Illustrator(TM) 3.2
%%AI8_CreatorVersion: 13.0.2
%%For: (User) ()
%%Title: (test file.eps)
%%CreationDate: 9/1/09 4:04 PM
%%BoundingBox: ${myBoundingBox.llx} ${myBoundingBox.lly} ${myBoundingBox.urx} ${myBoundingBox.ury}
%%DocumentProcessColors: Cyan Magenta Yellow Black
%%DocumentSuppliedResources: procset Adobe_packedarray 2.0 0
%%+ procset Adobe_cmykcolor 1.1 0
%%+ procset Adobe_cshow 1.1 0
%%+ procset Adobe_customcolor 1.0 0
%%+ procset Adobe_pattern_AI3 1.0 0
%%+ procset Adobe_Illustrator_AI3 1.0 1
%AI3_ColorUsage: Color
%AI3_IncludePlacedImages
%AI3_TemplateBox: 396.5 305.5 396.5 305.5
%AI3_TileBox: 108 -50 684 684
%AI3_DocumentPreview: Macintosh_ColorPic
%%PageOrigin:0 0
%AI7_GridSettings: 72 8 72 8 1 0 0.8 0.8 0.8 0.9 0.9 0.9
%AI9_Flatten: 1
%AI12_CMSettings: 00.MS
%%EndComments
%%BeginProlog
%%BeginResource: procset Adobe_packedarray 2.0 0
%%Title: (Packed Array Operators)
%%Version: 2.0 0
%%CreationDate: (8/2/90) ()
%%Copyright: ((C) 1987-1996 Adobe Systems Incorporated All Rights Reserved)

${drawing}
%%EOF`;

	const dialog = window.require('electron').remote.dialog;
	const fs = window.require('fs');
	dialog.showSaveDialog(function (filename) {
		if (filename === undefined) {
			return
		} else {
			fs.writeFile(filename, epsTemplate, (err) => {
			    if(err){
			        alert("An error ocurred creating the file "+ err.message)
			    }      
			    alert("The file has been succesfully saved");
			});
		}
	});
}