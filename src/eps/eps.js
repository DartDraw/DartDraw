import epsShape from './epsShape';
import boundingBox from './boundingBox';

export function generateEps(stateCopy) {
	console.log("made it to export/exportEps");
	var drawing = '';
	var myBoundingBox = new boundingBox(stateCopy.canvasHeight);

	for (var i = 0; i < stateCopy.shapes.allIds.length; i++) {
		var id = stateCopy.shapes.allIds[i];
		console.log(id);
		var shape = stateCopy.shapes.byId[id];

		var myShape = new epsShape(shape);
		drawing = drawing + myShape.produceEps(stateCopy.canvasHeight);
		myBoundingBox.updateBoundsIfNecessary(shape);
	}

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
		fs.writeFile(filename, epsTemplate, (err) => {
		    if(err){
		        alert("An error ocurred creating the file "+ err.message)
		    }
		                
		    alert("The file has been succesfully saved");
		});
	});
}