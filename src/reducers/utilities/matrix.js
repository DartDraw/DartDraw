const Matrix = require("transformation-matrix-js").Matrix;

export function multiplyMatrices(m1, m2) {
    if (m1.length !== 6 || m2.length !== 6) {
        console.log("multiplyMatrices expects two SVG transform matrices represented as arrays of length 6");
    }
    m1 = Matrix.from(...m1);
    m2 = Matrix.from(...m2);
    return m1.multiply(m2).toArray();
}

export function transformPoint(x, y, m) {
    if (m.length !== 6) {
        console.log("transformPoint expects m to be an SVG transform matrix represented as an array of length 6");
    }
    m = Matrix.from(...m);
    return m.applyToPoint(x, y);
}
