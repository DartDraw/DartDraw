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
    let formattedC = 'M ' + points[0] + ', ' + points[1];

    for (let i = 2; i < points.length; i += 2) {
        let p1 = i / 2 - 1;
        if (p1 < 1 && !controlPoints[0]) p1 = points.length / 2 - 1;
        let p2 = i / 2;
        if (p2 >= points.length / 2) p2 = 1;

        formattedC = formattedC + ' C ' + controlPoints[p1][1].x + ', ' + controlPoints[p1][1].y + ' ' + controlPoints[p2][0].x + ', ' + controlPoints[p2][0].y + ' ' + points[i] + ', ' + points[i + 1];
    }

    return formattedC;
}
