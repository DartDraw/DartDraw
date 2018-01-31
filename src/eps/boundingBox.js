class boundingBox {

	constructor(canvasHeight) {
		this.llx = Infinity;
		this.lly = Infinity;
		this.urx = -Infinity;
		this.ury = -Infinity;
		this.canvasHeight = canvasHeight;
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
				if ((this.canvasHeight - shape.y - shape.height) < this.lly) {
					this.lly = this.canvasHeight - shape.y - shape.height;
				}
				if ((this.canvasHeight - shape.y) > this.ury) {
					this.ury = this.canvasHeight - shape.y;
				} 
				break;

			default:
				break;
		}
	}
}

export default boundingBox;