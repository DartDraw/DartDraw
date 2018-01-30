import React, { Component } from 'react';
import PropTypes from 'prop-types';

class RulerLayer extends Component {
    static propTypes = {
        onSetGridRulers: PropTypes.func,
        onSetCanvasSize: PropTypes.func,
        dir: PropTypes.string,
        ruler: PropTypes.object,
        rulerWidth: PropTypes.number,
        width: PropTypes.number,
        height: PropTypes.number,
        showRulers: PropTypes.bool
    };

    componentWillMount() {
        this.props.onSetGridRulers();
    }

    renderHorizontalLabels() {
        const { ruler, rulerWidth } = this.props;
        return ruler.top.labels.map((label) => {
            return (
                <text
                    x={label[1]}
                    y={rulerWidth - label[0]}
                    textAnchor="start"
                    alignmentBaseline="hanging"
                >{label[2]}</text>
            );
        });
    }

    renderVerticalLabels() {
        const { ruler, rulerWidth } = this.props;
        return ruler.left.labels.map((label) => {
            return (
                <text
                    x={rulerWidth - label[0]}
                    y={label[1]}
                    textAnchor="start"
                    alignmentBaseline="hanging"
                >{label[2]}</text>
            );
        });
    }

    renderHorizontalTicks() {
        const { ruler, rulerWidth } = this.props;
        return ruler.top.ticks.map((tick) => {
            return (
                <line
                    x1={tick[1]}
                    y1={rulerWidth}
                    x2={tick[1]}
                    y2={rulerWidth - tick[0]}
                    stroke="black"
                />
            );
        });
    }

    renderVerticalTicks() {
        const { ruler, rulerWidth } = this.props;
        return ruler.left.ticks.map((tick) => {
            return (
                <line
                    x1={rulerWidth}
                    y1={tick[1]}
                    x2={rulerWidth - tick[0]}
                    y2={tick[1]}
                    stroke="black"
                />
            );
        });
    }

    render() {
        const { ruler, showRulers, rulerWidth, dir, width, height } = this.props;
        var trackerLoc = 0;
        switch (dir) {
            case "horizontal":
                trackerLoc = Math.max(0, Math.min(ruler.trackers.x - 45 - rulerWidth, width));
                return (
                    <svg className="ruler"
                        id={dir}
                        width={width}
                        height={rulerWidth}
                        display={showRulers ? "flex" : "none"}
                    >
                        {this.renderHorizontalTicks()}
                        {this.renderHorizontalLabels()}
                        <line
                            x1={trackerLoc}
                            y1={0}
                            x2={trackerLoc}
                            y2={rulerWidth}
                            stroke="#ebf1f5"
                        />
                    </svg>
                );
            case "vertical":
                trackerLoc = Math.max(0, Math.min(ruler.trackers.y - 45 - rulerWidth, height));
                return (
                    <svg className="ruler"
                        id={dir}
                        width={rulerWidth}
                        height={height}
                        display={showRulers ? "flex" : "none"}
                    >
                        {this.renderVerticalTicks()}
                        {this.renderVerticalLabels()}
                        <line
                            x1={0}
                            y1={trackerLoc}
                            x2={rulerWidth}
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
