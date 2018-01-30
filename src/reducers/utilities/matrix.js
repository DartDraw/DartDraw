import { Matrix } from 'transformation-matrix-js';

export function multiplyMatrices(m1, m2) {
    if (m1.length !== 6 || m2.length !== 6) {
        console.log("multiplyMatrices expects two SVG transform matrices represented as arrays of length 6");
    }
    m1 = Matrix.from(...m1);
    m2 = Matrix.from(...m2);
    var m3 = m1.multiply(m2);
    return m3.toArray();
}

export function transformPoint(x, y, m) {
    if (m.length !== 6) {
        console.log("transformPoint expects m to be an SVG transform matrix represented as an array of length 6");
    }
    m = Matrix.from(...m);
    return m.applyToPoint(x, y);
}

export function inverseTransform(m) {
    if (m.length !== 6) {
        console.log("inverseTransform expects m to be an SVG transform matrix represented as an array of length 6");
    }
    m = Matrix.from(...m);
    return m.inverse().toArray();
}

export function decomposedMatrix(m) {
    var t,r,s,k,E,F,G,H,Q,R,sx,sy,a1,a2,theta,phi,sqrt=Math.sqrt,atan2=Math.atan2;
    // http://math.stackexchange.com/questions/861674/decompose-a-2d-arbitrary-transform-into-only-scaling-and-rotation
    // 
    // It works wonderfully! Thanks. 
    // The input matrix is transposed though, 
    // so let me spell the solution out. 
    

    E=(m[0]+m[3])/2
    F=(m[0]-m[3])/2
    G=(m[2]+m[1])/2
    H=(m[2]-m[1])/2

    Q=sqrt(E*E+H*H);
    R=sqrt(F*F+G*G);
    sx=Q+R; 
    sy=Q-R; 
    a1=atan2(G,F); 
    a2=atan2(H,E); 
    theta=(a2-a1)/2; 
    phi=(a2+a1)/2;

    // The requested parameters are then theta, 
    // sx, sy, phi,
    //  i.e. rotate by theta, 
    k=-theta*180/Math.PI;
    //  scale by sx,sy, 
    s=[sx,sy];
    //  rotate by phi. 
    r=-phi*180/Math.PI;
    //No division by zero or sqrt(negative) hazard. Excellent. 
    t=[m[4],m[5]];
    return {translate:t,rotate:r,scale:s,skew:k};
}

export function decomposed_toString(tr) {
  return [ 
        "translate(" + tr.translate.join(",") + ")",
        "rotate(" + tr.skew + ")", 
        "scale(" + tr.scale.join(",") + ")",
        "rotate(" + tr.rotate + ")",
  ].join(" ");
};
