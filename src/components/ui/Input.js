import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './ui.css';

class Input extends Component {
    static propTypes = {
        value: PropTypes.any,
        label: PropTypes.string,
        className: PropTypes.string,
        style: PropTypes.object,
        onChange: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.state = {
            value: props.value
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.value !== nextProps.value) {
            this.setState({
                value: nextProps.value
            });
        }
    }

    handleChange(event) {
        this.setState({
            value: event.target.value
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        const { onChange } = this.props;
        onChange && onChange(this.state.value);
    }

    render() {
        const { label, className, style } = this.props;
        const { value } = this.state;
        return (
            <div className={`input-container ${className || ''}`} style={style}>
                <form onSubmit={this.handleSubmit}>
                    <input value={value ? Math.round(value * 100) / 100 : value} onChange={this.handleChange} className="input" />
                </form>
                { label && <div className="input-label">{label}</div> }
            </div>
        );
    }
}

export default Input;
