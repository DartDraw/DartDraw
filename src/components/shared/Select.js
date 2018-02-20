import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Select extends Component {
    static propTypes = {
        value: PropTypes.object,
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
        this.setState({
            value: nextProps.value
        });
    }

    handleChange(event) {
        const { onChange } = this.props;
        onChange && onChange(event.target.value);
    }

    render() {
        const { children } = this.props;
        const { value } = this.state;
        return <select value={value} onChange={this.handleChange}>{children}</select>;
    }
}

export default Select;
