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
            return (
                <text
                    x={label[1]}
                    y={ruler.width - label[0]}
                    textAnchor="start"
                    alignmentBaseline="hanging"
                >{label[2]}</text>
            );
        });
    }

    renderVerticalLabels() {
        const { ruler } = this.props;
        return ruler.vertical.labels.map((label) => {
            return (
                <text
                    x={ruler.width - label[0]}
                    y={label[1]}
                    textAnchor="start"
                    alignmentBaseline="hanging"
                >{label[2]}</text>
            );
        });
    }

    renderHorizontalTicks() {
        const { ruler } = this.props;
        return ruler.horizontal.ticks.map((tick) => {
            return (
                <line
                    x1={tick[1]}
                    y1={ruler.width}
                    x2={tick[1]}
                    y2={ruler.width - tick[0]}
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
                    y1={tick[1]}
                    x2={ruler.width - tick[0]}
                    y2={tick[1]}
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
