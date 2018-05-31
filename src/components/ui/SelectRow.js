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

        const childrenElements = children.map((child, i) => {
            const newStyle = {
                backgroundColor: child.props.value === value ? '#10161A' : '#202B33'
            };
            return React.cloneElement(child, {
                key: child.props.value,
                style: Object.assign(child.props.style || {}, newStyle),
                onClick: () => {
                    this.handleChange(child.props.value);
                }
            });
        });

        return (
            <div className={`select-row-container ${className || ''}`} style={style}>
                {childrenElements}
            </div>
        );
    }
}

export default SelectRow;
