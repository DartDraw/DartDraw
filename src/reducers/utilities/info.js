import { transformPoint } from './matrix';
import { decomposeMatrix } from './shapes';

export function getShapeInfo(shape) {
    switch (shape.type) {
        case 'rectangle':
            return getRectangleInfo(shape);
        case 'ellipse':
            return getEllipseInfo(shape);
        case 'polygon':
            return getPolygonInfo(shape);
        case 'polyline':
            return getPolylineInfo(shape);
        case 'bezier':
            return getBezierInfo(shape);
        case 'arc':
            return getArcInfo(shape);
        case 'path':
            return getPathInfo(shape);
        case 'freehandPath':
            return getFreehandPathInfo(shape);
        case 'line':
            return getLineInfo(shape);
        case 'text':
            return getTextInfo(shape);
        default:
            return {};
    }
}

function getRectangleInfo(shape) {
    const shapeInfo = {};

    shapeInfo.x = transformPoint(shape.x, shape.y, shape.transform[0].parameters).x;
    shapeInfo.y = transformPoint(shape.x, shape.y, shape.transform[0].parameters).y;

    shapeInfo.rotation = decomposeMatrix(shape.transform[0].parameters).skewX * 180 / Math.PI % 360;
    if (shapeInfo.rotation < 0) shapeInfo.rotation += 360;

    let coords = [];
    coords[0] = transformPoint(shape.x + shape.width, shape.y, shape.transform[0].parameters);
    coords[1] = transformPoint(shape.x + shape.width, shape.y + shape.height, shape.transform[0].parameters);
    coords[2] = transformPoint(shape.x, shape.y + shape.height, shape.transform[0].parameters);
    coords[3] = transformPoint(shape.x, shape.y, shape.transform[0].parameters);

    shapeInfo.width = Math.sqrt((coords[0].x - coords[3].x) ** 2 + (coords[0].y - coords[3].y) ** 2);
    shapeInfo.height = Math.sqrt((coords[0].x - coords[1].x) ** 2 + (coords[0].y - coords[1].y) ** 2);

    return shapeInfo;
}

function getEllipseInfo(shape) {
    const shapeInfo = {};

    shapeInfo.cx = transformPoint(shape.cx, shape.cy, shape.transform[0].parameters).x;
    shapeInfo.cy = transformPoint(shape.cx, shape.cy, shape.transform[0].parameters).y;

    shapeInfo.rotation = decomposeMatrix(shape.transform[0].parameters).skewX * 180 / Math.PI % 360;
    if (shapeInfo.rotation < 0) shapeInfo.rotation += 360;

    shapeInfo.rx = transformPoint(shape.cx + shape.rx, shape.cy, shape.transform[0].parameters).x - transformPoint(shape.cx, shape.cy, shape.transform[0].parameters).x;
    shapeInfo.ry = transformPoint(shape.cx, shape.cy + shape.ry, shape.transform[0].parameters).y - transformPoint(shape.cx, shape.cy, shape.transform[0].parameters).y;

    return shapeInfo;
}

function getPolygonInfo(shape) {
    const shapeInfo = {};
    return shapeInfo;
}

function getPolylineInfo(shape) {
    const shapeInfo = {};
    return shapeInfo;
}

function getBezierInfo(shape) {
    const shapeInfo = {};
    return shapeInfo;
}

function getArcInfo(shape) {
    const shapeInfo = {};
    return shapeInfo;
}

function getPathInfo(shape) {
    const shapeInfo = {};
    return shapeInfo;
}

function getFreehandPathInfo(shape) {
    const shapeInfo = {};
    return shapeInfo;
}

function getLineInfo(shape) {
    const shapeInfo = {};
    return shapeInfo;
}

function getTextInfo(shape) {
    const shapeInfo = {};
    return shapeInfo;
}
