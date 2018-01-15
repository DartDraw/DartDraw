export function openDartDrawFile(root) {
	const dialog = window.require('electron').remote.dialog;
	const fs = window.require('fs');

	var promise = new Promise(function(resolve, reject) {
		dialog.showOpenDialog(function (filenames) {
			var filename = filenames[0];
			var updatedState;
			fs.readFile(filename, "utf8", (err, data) => {
				if (err) {
					alert("An error occurred reading the file");
				}
				else {
					var bufferString = data.toString();
					updatedState = JSON.parse(bufferString);
				}
			});
			resolve(updatedState);
		});
	});

	return promise;
}