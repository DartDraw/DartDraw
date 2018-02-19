import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './ui.css';

class SelectRow extends Component {
    static propTypes = {
        value: PropTypes.any,
        children: PropTypes.array,
        className: PropTypes.string,
        style: PropTypes.object,
        onChange: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(value) {
        const { onChange } = this.props;
        onChange && onChange(value);
    }

    render() {
        const { value, children, className, style } = this.props;

        const childrenElements = children.map(child => {
            const newStyle = child.props.key === value ? { backgroundColor: '#202B33' } : {};
            React.cloneElement(child, newStyle);
        });

        return (
            <div className={`select-row-container ${className}`} style={style}>
                {childrenElements}
            </div>
        );
    }
}

export default SelectRow;
