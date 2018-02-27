import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './ui.css';

class Select extends Component {
    static propTypes = {
        value: PropTypes.any,
        label: PropTypes.string,
        className: PropTypes.string,
        style: PropTypes.object,
        onChange: PropTypes.func,
        children: PropTypes.array
    };

    constructor(props) {
        super(props);

        this.state = {
            value: props.value
        };

        this.handleChange = this.handleChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.value !== nextProps.value) {
            this.setState({
                value: nextProps.value
            });
        }
    }

    handleChange(event) {
        const { onChange } = this.props;
        onChange && onChange(event.target.value);
    }

    render() {
        const { children, label, style } = this.props;
        const { value } = this.state;
        return (
            <div style={style} className={`select-container className`}>
                <select value={value} onChange={this.handleChange} className="select">{children}</select>
                <div className="select-label">{label}</div>
            </div>
        );
    }
}

export default Select;
