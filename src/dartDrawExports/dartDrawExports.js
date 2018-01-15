export function generateDartDrawFile(rootCopy) {
	var rootString = JSON.stringify(rootCopy);

	const dialog = window.require('electron').remote.dialog;
	const fs = window.require('fs');

	dialog.showSaveDialog(function (filename) {
		fs.writeFile(filename, rootString, (err) => {
		    if(err){
		        alert("An error ocurred creating the file "+ err.message)
		    }
		                
		    alert("The DartDraw file has been succesfully saved");
		});
	});
}