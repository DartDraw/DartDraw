export function zoomIn(stateCopy, action) {
    const scale = 2;
    const { panX, panY } = zoom(stateCopy, stateCopy.scale, scale);
    stateCopy.scale *= scale;
    stateCopy.panX = panX;
    stateCopy.panY = panY;
    return stateCopy;
}

export function zoomOut(stateCopy, action) {
    const scale = 0.5;
    const { panX, panY } = zoom(stateCopy, stateCopy.scale, scale);
    stateCopy.scale *= scale;
    stateCopy.panX = panX;
    stateCopy.panY = panY;
    return stateCopy;
}

export function zoom(stateCopy, scale, currScale) {
    // var { canvasWidth, canvasHeight, panX, panY } = stateCopy;

    // console.log(canvasWidth, canvasHeight, window.innerWidth, window.innerHeight, panX, panY, scale, currScale);

    // panX = panX + ((canvasWidth / 2) / scale) - (((window.innerWidth - 38) / (scale * currScale)) / 2);

    // console.log(panX);

    var panX = 0;
    var panY = 0;

    // panX = clamp(0, panX, canvasWidth - (window.innerWidth - 38) / scale);
    // panY = clamp(0, panY, canvasHeight - (window.innerHeight - 43) / scale);

    //
    // panX = panX + (canvasWidth / 2) - ((canvasWidth / 2) / scale);
    // panY = panY + (canvasHeight / 2) - ((canvasHeight / 2) / scale);
    //
    // if (scale > 1) {
    //     panX = clamp(0, panX, canvasWidth - (window.innerWidth - 38) / scale);
    //     panY = clamp(0, panY, canvasHeight - (window.innerHeight - 43) / scale);
    // }

    // if (scale > 1) {
    //     var newX = 0;
    //     var newY = 0;
    //     panX = newX;
    //     panY = newY;
    // } else {
    //     panX = 0;
    //     panY = 0;
    // }

    // var panX = 0;
    // var panY = 0;

    return { panX, panY };
}

export function zoomTo(marqueeBox, canvasWidth, canvasHeight) {
    const newScale = Math.min(Math.abs((window.innerWidth - 38) / marqueeBox.width), Math.abs((window.innerHeight - 43) / marqueeBox.height));

    let panX, panY, scale;

    scale = newScale;
    panX = marqueeBox.x;
    panY = marqueeBox.y;
    // panX = (canvasWidth / 2) - (scale * (marqueeBox.x + (marqueeBox.width / 2)));
    // panY = (canvasHeight / 2) - (scale * (marqueeBox.y + (marqueeBox.height / 2)));

    return {panX, panY, scale};
}

export function pan(stateCopy, draggableData) {
    const { canvasWidth, canvasHeight, scale } = stateCopy;
    const { deltaX, deltaY } = draggableData;

    if (scale > 1) {
        var panX = stateCopy.panX - deltaX / scale;
        var panY = stateCopy.panY - deltaY / scale;

        // The values 38 and 43 are the widths and heights of the menus.
        // Needs to change if menu changes.
        return {
            panX: clamp(panX, 0, canvasWidth - (window.innerWidth - 38) / scale),
            panY: clamp(panY, 0, canvasHeight - (window.innerHeight - 43) / scale)
        };
    } else {
        return { panX: stateCopy.panX, panY: stateCopy.panY };
    }
}

function clamp(num, min, max) {
    return Math.max(min, Math.min(num, max));
}
