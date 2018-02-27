import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './dd-modal.css';

class Modal extends Component {
    static propTypes = {
        form: PropTypes.object,
        modalName: PropTypes.string
    };

    render() {
        return (
            <div className="modal">
                <h1>{this.props.modalName}</h1>
                {this.props.form}
            </div>
        );
    }
}

export default Modal;
