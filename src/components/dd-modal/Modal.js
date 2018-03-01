import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './dd-modal.css';

class Modal extends Component {
    static propTypes = {
        formContent: PropTypes.object,
        modalName: PropTypes.string,
        settingsModalVisible: PropTypes.bool,
        unitType: PropTypes.string,
        unitDivisions: PropTypes.number,
        canvasWidthInUnits: PropTypes.number,
        canvasHeightInUnits: PropTypes.number,
        onToggleSettingsModal: PropTypes.func,
        onSetRulerGrid: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleSubmitRulerGrid = this.handleSubmitRulerGrid.bind(this);
        this.handleToggleSettingsModal = this.handleToggleSettingsModal.bind(this);
    }

    handleFormSubmit(e) {
        e.preventDefault();
        // onSubmitRulerGrid (pass object)
        console.log(e.target.value);
    }

    handleToggleSettingsModal() {
        this.props.onToggleSettingsModal();
    }

    handleSubmitRulerGrid(event) {
        event.preventDefault();
        this.props.onSetRulerGrid({
            unitType: document.getElementById("unitType").value,
            width: document.getElementById("width").value,
            height: document.getElementById("height").value,
            unitDivisions: document.getElementById("unitDivisions").value
        });
    }

    render() {
        const {canvasWidthInUnits, canvasHeightInUnits, unitDivisions, unitType} = this.props;
        let settingsModal = null;
        if (this.props.settingsModalVisible) {
            settingsModal =
                <div className="modal">
                    <h1>Settings</h1>
                    <form id="button-icon" onSubmit={(event) => { this.handleSubmitRulerGrid(event); }}>
                        <select
                            id="unitType"
                            defaultValue={unitType}
                        >
                            <option value="in">{"in"}</option>
                            <option value="ft">ft</option>
                            <option value="mm">mm</option>
                            <option value="cm">cm</option>
                            <option value="m">m</option>
                            <option value="px">px</option>
                            <option value="pt">pt</option>
                        </select>
                        <div id="inline-close">
                            <p>Width:</p><input
                                id="width"
                                defaultValue={canvasWidthInUnits}
                                type="number"
                                step="0.1"
                            />
                            <span />
                            <p>Height:</p><input
                                id="height"
                                defaultValue={canvasHeightInUnits}
                                type="number"
                                step="0.1"
                            />
                        </div>
                        <p>Unit Divisions:</p><input
                            id="unitDivisions"
                            defaultValue={unitDivisions}
                            type="number"
                        />
                        <p />
                        <input type="submit" value="resize" id="basic-button" />
                    </form>
                    <button id="basic-button" onClick={this.handleToggleSettingsModal}>Done</button>

                </div>;
        } else {
            settingsModal = <div />;
        }
        return (
            <div>
                {settingsModal}
            </div>
        );
    }
}

export default Modal;
