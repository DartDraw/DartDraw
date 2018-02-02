import React, { Component } from 'react';
import PropTypes from 'prop-types';

class RulerLayer extends Component {
    static propTypes = {
        onSetRulerGrid: PropTypes.func,
        dir: PropTypes.string,
        ruler: PropTypes.object,
        width: PropTypes.number,
        height: PropTypes.number,
        widthInUnits: PropTypes.number,
        heightInUnits: PropTypes.number,
        showRulers: PropTypes.bool
    };

    componentWillMount() {
        const { ruler, widthInUnits, heightInUnits } = this.props;
        this.props.onSetRulerGrid({
            unitType: ruler.unitType,
            width: widthInUnits,
            height: heightInUnits,
            unitDivisions: ruler.unitDivisions
        });
    }

    buildLabel(num, x, y, textAnchor, dominantBaseline, key) {
        return (
            <text
                key={key}
                x={x}
                y={y}
                textAnchor={textAnchor}
                dominantBaseline={dominantBaseline}
            >{num}</text>
        );
    }

    buildTick(x1, y1, x2, y2, key) {
        return (
            <line
                key={key}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="black"
            />
        );
    }

    buildTracker(x1, y1, x2, y2) {
        return (
            <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#ebf1f5"
            />
        );
    }

    renderLabels(labels) {
        const { dir } = this.props;
        var offset = 3;

        return labels.map((label) => {
            var x, y, textAnchor, dominantBaseline;
            switch (dir) {
                case "horizontal":
                    x = label.loc + (label.final ? -offset : offset);
                    y = offset;
                    textAnchor = label.final ? "end" : "start";
                    dominantBaseline = "hanging";
                    break;
                case "vertical":
                    x = offset;
                    y = label.loc + (label.final ? -offset : offset);
                    textAnchor = "start";
                    dominantBaseline = label.final ? "baseline" : "hanging";
                    break;
                default: break;
            }

            return (this.buildLabel(label.num, x, y, textAnchor, dominantBaseline, label.loc));
        });
    }

    renderTicks(ticks) {
        const { dir, ruler } = this.props;
        var x1, y1, x2, y2;
        return ticks.map((tick) => {
            switch (dir) {
                case "horizontal":
                    x1 = tick.loc;
                    y1 = ruler.width;
                    x2 = tick.loc;
                    y2 = ruler.width - tick.length;
                    break;
                case "vertical":
                    x1 = ruler.width;
                    y1 = tick.loc;
                    x2 = ruler.width - tick.length;
                    y2 = tick.loc;
                    break;
                default: break;
            }

            return (this.buildTick(x1, y1, x2, y2, tick.loc));
        });
    }

    render() {
        const { ruler, showRulers, dir, width, height } = this.props;
        var trackerLoc = 0;
        switch (dir) {
            case "horizontal":
                trackerLoc = Math.max(0, Math.min(ruler.mouseCoords.x - ruler.width - 45, width));
                return (
                    <svg className="ruler"
                        id={dir}
                        width={width}
                        height={ruler.width}
                        style={{paddingLeft: ruler.width}}
                        display={showRulers ? "flex" : "none"}
                    >
                        {this.renderTicks(ruler.horizontal.ticks)}
                        {this.renderLabels(ruler.horizontal.labels)}
                        {this.buildTracker(trackerLoc, 0, trackerLoc, ruler.width)}
                    </svg>
                );
            case "vertical":
                trackerLoc = Math.max(0, Math.min(ruler.mouseCoords.y - ruler.width - 45, height));
                return (
                    <svg className="ruler"
                        id={dir}
                        width={ruler.width}
                        height={height}
                        display={showRulers ? "flex" : "none"}
                    >
                        {this.renderTicks(ruler.vertical.ticks)}
                        {this.renderLabels(ruler.vertical.labels)}
                        {this.buildTracker(0, trackerLoc, ruler.width, trackerLoc)}
                    </svg>
                );
            default: break;
        }
    }
}

export default RulerLayer;
