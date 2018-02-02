import React, { Component } from 'react';
import PropTypes from 'prop-types';

class RulerLayer extends Component {
    static propTypes = {
        onSetRulerGrid: PropTypes.func,
        dir: PropTypes.string,
        ruler: PropTypes.object,
        width: PropTypes.number,
        height: PropTypes.number,
        showRulers: PropTypes.bool
    };

    componentWillMount() {
        this.props.onSetRulerGrid({
            unitType: 'in',
            width: 11,
            height: 8.5,
            unitDivisions: 2
        });
    }

    renderHorizontalLabels() {
        const { ruler } = this.props;
        return ruler.horizontal.labels.map((label) => {
            var offset = 3;
            if (label.final) { offset = -3; }
            return (
                <text
                    x={label.loc + offset}
                    y={3}
                    textAnchor={label.final ? "end" : "start"}
                    dominantBaseline="hanging"
                >{label.num}</text>
            );
        });
    }

    renderVerticalLabels() {
        const { ruler } = this.props;
        console.log(ruler.vertical.labels);
        return ruler.vertical.labels.map((label) => {
            var offset = 3;
            if (label.final) { offset = -offset; }
            return (
                <text
                    x={3}
                    y={label.loc + offset}
                    textAnchor="start"
                    dominantBaseline={label.final ? "" : "hanging"}
                >{label.num}</text>
            );
        });
    }

    renderHorizontalTicks() {
        const { ruler } = this.props;
        return ruler.horizontal.ticks.map((tick) => {
            return (
                <line
                    x1={tick.loc}
                    y1={ruler.width}
                    x2={tick.loc}
                    y2={ruler.width - tick.length}
                    stroke="black"
                />
            );
        });
    }

    renderVerticalTicks() {
        const { ruler } = this.props;
        return ruler.vertical.ticks.map((tick) => {
            return (
                <line
                    x1={ruler.width}
                    y1={tick.loc}
                    x2={ruler.width - tick.length}
                    y2={tick.loc}
                    stroke="black"
                />
            );
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
                        {this.renderHorizontalTicks()}
                        {this.renderHorizontalLabels()}
                        <line
                            x1={trackerLoc}
                            y1={0}
                            x2={trackerLoc}
                            y2={ruler.width}
                            stroke="#ebf1f5"
                        />
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
                        {this.renderVerticalTicks()}
                        {this.renderVerticalLabels()}
                        <line
                            x1={0}
                            y1={trackerLoc}
                            x2={ruler.width}
                            y2={trackerLoc}
                            stroke="#ebf1f5"
                        />
                    </svg>
                );
            default: break;
        }
    }
}

export default RulerLayer;
