import React, { Component } from 'react';
import PropTypes from 'prop-types';

class RulerLayer extends Component {
    static propTypes = {
        onSetRulers: PropTypes.func,
        onSetGrid: PropTypes.func,
        dir: PropTypes.string,
        ruler: PropTypes.object,
        rulerWidth: PropTypes.number
    };

    componentWillMount() {
        this.props.onSetRulers();
        this.props.onSetGrid();
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
        const { rulerWidth, dir } = this.props;
        switch (dir) {
            case "horizontal":
                return (
                    <svg className="ruler"
                        id={dir}
                        width={window.innerWidth - rulerWidth - 45}
                        height={rulerWidth}
                    >
                        {this.renderHorizontalTicks()}
                        {this.renderHorizontalLabels()}
                    </svg>
                );
            case "vertical":
                return (
                    <svg className="ruler"
                        id={dir}
                        width={rulerWidth}
                        height={window.innerHeight - rulerWidth - 45}
                    >
                        {this.renderVerticalTicks()}
                        {this.renderVerticalLabels()}
                    </svg>
                );
            default: break;
        }
    }
}

export default RulerLayer;
