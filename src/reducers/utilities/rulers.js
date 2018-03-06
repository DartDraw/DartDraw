import { MENU_WIDTH } from '../../constants';

export function updateMouseTrackers(x, y, rulerWidth, canvasWidth, canvasHeight, gridSnapping, gridSnapInterval) {
    var mouseTrackerX = Math.max(0, Math.min(x - rulerWidth - MENU_WIDTH, canvasWidth));
    var mouseTrackerY = Math.max(0, Math.min(y - rulerWidth - MENU_WIDTH, canvasHeight));

    if (gridSnapping) {
        mouseTrackerX = Math.round(mouseTrackerX / gridSnapInterval) * gridSnapInterval;
        mouseTrackerY = Math.round(mouseTrackerY / gridSnapInterval) * gridSnapInterval;
    }

    return {x: mouseTrackerX, y: mouseTrackerY};
}
