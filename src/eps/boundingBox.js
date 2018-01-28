class boundingBox {

	constructor(canvasHeightInPixels) {
		this.llx = Infinity;
		this.lly = Infinity;
		this.urx = -Infinity;
		this.ury = -Infinity;
		this.canvasHeightInPixels = canvasHeightInPixels;
		this.updateBoundsIfNecessary = this.updateBoundsIfNecessary.bind(this);
	}

	updateBoundsIfNecessary(shape) {

		var str = shape.fill;
		var rawRGB = str.substring(5, str.length-1);
		var array = rawRGB.split(',');

		var color = '';
		for (var i = 0; i < 3; i++) {
			color = color + array[0];
		}

		if (color === '255255255') {
			return;
		}

		switch (shape.type) {
			case "rectangle":
				if (shape.x < this.llx) {
					this.llx = shape.x;
				}
				if ((shape.x + shape.width) > this.urx) {
					this.urx = shape.x + shape.width;
				}
				if ((this.canvasHeightInPixels - shape.y - shape.height) < this.lly) {
					this.lly = this.canvasHeightInPixels - shape.y - shape.height;
				}
				if ((this.canvasHeightInPixels - shape.y) > this.ury) {
					this.ury = this.canvasHeightInPixels - shape.y;
				} 
				break;

			default:
				break;
		}
	}
}

export default boundingBox;