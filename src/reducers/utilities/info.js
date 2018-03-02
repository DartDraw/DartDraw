import { transformPoint } from './matrix';
import { decomposeMatrix } from './shapes';

export function getShapeInfo(shape, boundingBox) {
    switch (shape.type) {
        case 'rectangle':
            return getRectangleInfo(shape, boundingBox);
        case 'ellipse':
            return getEllipseInfo(shape, boundingBox);
        case 'polygon':
            return getPolygonInfo(shape, boundingBox);
        case 'polyline':
            return getPolylineInfo(shape, boundingBox);
        case 'bezier':
            return getBezierInfo(shape, boundingBox);
        case 'arc':
            return getArcInfo(shape, boundingBox);
        case 'path':
            return getPathInfo(shape, boundingBox);
        case 'freehandPath':
            return getFreehandPathInfo(shape, boundingBox);
        case 'line':
            return getLineInfo(shape, boundingBox);
        case 'text':
            return getTextInfo(shape, boundingBox);
        default:
            return {};
    }
}

function getRectangleInfo(shape, boundingBox) {
    const shapeInfo = {};

    shapeInfo.x = transformPoint(shape.x, shape.y, shape.transform[0].parameters).x;
    shapeInfo.y = transformPoint(shape.x, shape.y, shape.transform[0].parameters).y;

    console.log(decomposeMatrix(shape.transform[0].parameters));
    shapeInfo.rotation = decomposeMatrix(shape.transform[0].parameters).skewX * 180 / Math.PI % 360;
    if (shapeInfo.rotation < 0) shapeInfo.rotation += 360;

    let coords = [];
    coords[0] = transformPoint(boundingBox.x + boundingBox.width, boundingBox.y, shape.transform[0].parameters);
    coords[1] = transformPoint(boundingBox.x + boundingBox.width, boundingBox.y + boundingBox.height, shape.transform[0].parameters);
    coords[2] = transformPoint(boundingBox.x, boundingBox.y + boundingBox.height, shape.transform[0].parameters);
    coords[3] = transformPoint(boundingBox.x, boundingBox.y, shape.transform[0].parameters);

    shapeInfo.width = Math.sqrt((coords[0].x - coords[3].x) ** 2 + (coords[0].y - coords[3].y) ** 2);
    shapeInfo.height = Math.sqrt((coords[0].x - coords[1].x) ** 2 + (coords[0].y - coords[1].y) ** 2);

    return shapeInfo;
}

function getEllipseInfo(shape, boundingBox) {
    const shapeInfo = {};
    return shapeInfo;
}

function getPolygonInfo(shape, boundingBox) {
    const shapeInfo = {};
    return shapeInfo;
}

function getPolylineInfo(shape, boundingBox) {
    const shapeInfo = {};
    return shapeInfo;
}

function getBezierInfo(shape, boundingBox) {
    const shapeInfo = {};
    return shapeInfo;
}

function getArcInfo(shape, boundingBox) {
    const shapeInfo = {};
    return shapeInfo;
}

function getPathInfo(shape, boundingBox) {
    const shapeInfo = {};
    return shapeInfo;
}

function getFreehandPathInfo(shape, boundingBox) {
    const shapeInfo = {};
    return shapeInfo;
}

function getLineInfo(shape, boundingBox) {
    const shapeInfo = {};
    return shapeInfo;
}

function getTextInfo(shape, boundingBox) {
    const shapeInfo = {};
    return shapeInfo;
}
