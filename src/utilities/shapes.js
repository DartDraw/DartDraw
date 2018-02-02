export function formatPath(d) {
    if (!d) {
        return '';
    }
    let formattedD = '';
    d.map(command => {
        formattedD = formattedD + command.command + ' ';
        command.parameters.map(parameter => {
            formattedD = formattedD + parameter + ' ';
        });
    });
    return formattedD;
}

export function formatTransform(transform) {
    if (!transform) {
        return '';
    }
    let formattedTransform = '';
    transform.map(command => {
        formattedTransform = formattedTransform + command.command + '(';
        command.parameters.map(parameter => {
            formattedTransform = formattedTransform + parameter + ' ';
        });
        formattedTransform = formattedTransform + ') ';
    });
    return formattedTransform;
}

export function formatPoints(points) {
    if (!points) {
        return '';
    }
    let formattedP = '';

    for (let i = 0; i < points.length; i += 2) {
        formattedP = formattedP + points[i] + ',' + points[i + 1] + ' ';
    }
    return formattedP;
}

export function formatCurve(points, controlPoints) {
    if (!points || !controlPoints) {
        return '';
    }
    console.log(points, controlPoints);
    let formattedC = 'M ' + points[0] + ', ' + points[1];

    for (let i = 2; i < points.length; i += 2) {
        let cIndex = i / 2;
        console.log(cIndex);
        formattedC = formattedC + ' C ' + controlPoints[cIndex][0].x + ', ' + controlPoints[cIndex][0].y + ' ' + controlPoints[cIndex][1].x + ', ' + controlPoints[cIndex][1].y + ' ' + points[i] + ', ' + points[i + 1];
    }
    console.log(formattedC);
    return formattedC;
}
