import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Input extends Component {
    static propTypes = {
        value: PropTypes.object,
        onChange: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.state = {
            value: props.value
        };

        this.handleChange = this.handleChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            value: nextProps.value
        });
    }

    handleChange(event) {
        const { onChange } = this.props;
        onChange && onChange(event.target.value);
    }

    render() {
        const { value } = this.state;
        return <input value={value} onChange={this.handleChange} />;
    }
}

export default Input;
