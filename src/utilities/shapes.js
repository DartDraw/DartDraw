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

export function formatArc(d) {
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
