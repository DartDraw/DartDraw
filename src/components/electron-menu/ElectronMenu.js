import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from '../dd-modal/Modal';

const { remote } = window.require('electron');
const { Menu, MenuItem, BrowserWindow } = remote;
let top = remote.getCurrentWindow();

class ElectronMenu extends Component {
    static propTypes = {
        scale: PropTypes.number,
        settingsModalVisible: PropTypes.bool,
        onToggleSettingsModal: PropTypes.func,
        onMoveForward: PropTypes.func,
        onMoveBackward: PropTypes.func,
        onSendToBack: PropTypes.func,
        onBringToFront: PropTypes.func,
        onFlipHorizontal: PropTypes.func,
        onFlipVertical: PropTypes.func,
        onShowRulers: PropTypes.func,
        onShowGrid: PropTypes.func,
        onShowSubDivisions: PropTypes.func,
        onGroupClick: PropTypes.func,
        onUngroupClick: PropTypes.func,
        onToolSelect: PropTypes.func,
        onSetCustomZoom: PropTypes.func,
        onUndoClick: PropTypes.func,
        onRedoClick: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.openDialog = this.openDialog.bind(this);
        this.handleToggleSettingsModal = this.handleToggleSettingsModal.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }

    handleZoomIn() {
        this.props.onSetCustomZoom(this.props.scale * 2);
    }

    handleZoomOut() {
        this.props.onSetCustomZoom(this.props.scale / 2);
    }

    componentDidMount() {
        const template = [
            {label: 'File'},
            {
                label: 'Edit',
                submenu: [
                    {role: 'undo', click: () => { this.props.onUndoClick(); }},
                    {role: 'redo', click: () => { this.props.onRedoClick(); }},
                    {type: 'separator'},
                    {role: 'cut'},
                    {role: 'copy'},
                    {role: 'paste'},
                    {label: 'Clear'},
                    {type: 'separator'},
                    {label: 'Duplicate', accelerator: 'CmdOrCtrl+D'},
                    {role: 'selectall'},
                    {type: 'separator'},
                    {label: 'Round Corners...'},
                    {label: 'Reshape', accelerator: 'CmdOrCtrl+Shift+R'},
                    {label: 'Smooth', accelerator: 'CmdOrCtrl+E'},
                    {label: 'Unsmooth', accelerator: 'CmdOrCtrl+Shift+E'}
                ]
            },
            {
                label: 'View',
                submenu: [
                    {label: 'Toggle Rulers', click: () => { this.props.onShowRulers(); }},
                    {label: 'Toggle Gridlines', click: () => { this.props.onShowGrid(); }},
                    {label: 'Toggle Grid Subdivisions', click: () => { this.props.onShowSubDivisions(); }},
                    {type: 'separator'},
                    {role: 'reload'},
                    {role: 'forcereload'},
                    {role: 'toggledevtools'},
                    {type: 'separator'},
                    {role: 'resetzoom'},
                    {role: 'zoomin', click: () => { this.handleZoomIn(); }},
                    {role: 'zoomout', click: () => { this.handleZoomOut(); }},
                    {type: 'separator'},
                    {role: 'togglefullscreen'}
                ]
            },
            {
                label: 'Layout',
                submenu: [
                    {label: 'Turn Autogrid Off', accelerator: 'CmdOrCtrl+Y'},
                    {label: 'Drawing Size...'},
                    {label: 'Rulers...'},
                    {type: 'separator'},
                    {label: 'Preferences...'}
                ]
            },
            {
                label: 'Arrange',
                submenu: [
                    {label: 'Move Forward', accelerator: 'CmdOrCtrl+F', click: () => { this.props.onMoveForward(); }},
                    {label: 'Move To Front', accelerator: 'CmdOrCtrl+Shift+F', click: () => { this.props.onBringToFront(); }},
                    {label: 'Move Backward', accelerator: 'CmdOrCtrl+J', click: () => { this.props.onMoveBackward(); }},
                    {label: 'Move To Back', accelerator: 'CmdOrCtrl+Shift+J', click: () => { this.props.onSendToBack(); }},
                    {type: 'separator'},
                    {label: 'Align', accelerator: 'CmdOrCtrl+K'},
                    {label: 'Alignment', accelerator: 'CmdOrCtrl+Shift+K'},
                    {type: 'separator'},
                    {label: 'Rotate', accelerator: 'CmdOrCtrl+T', click: () => { this.props.onToolSelect("rotateTool"); }},
                    {label: 'Flip Horizontal', click: () => { this.props.onFlipHorizontal(); }},
                    {label: 'Flip Vertical', click: () => { this.props.onFlipVertical(); }},
                    {label: 'Scale Selection...'},
                    {type: 'separator'},
                    {label: 'Group', accelerator: 'CmdOrCtrl+G', click: () => { this.props.onGroupClick(); }},
                    {label: 'Ungroup', accelerator: 'CmdOrCtrl+Shift+G', click: () => { this.props.onUngroupClick(); }},
                    {label: 'Lock', accelerator: 'CmdOrCtrl+H'},
                    {label: 'Unlock', accelerator: 'CmdOrCtrl+Shift+H'}
                ]
            },
            {
                label: 'Settings',
                submenu: [
                    {label: 'Canvas Settings',
                        click: () => {
                            this.handleToggleSettingsModal();
                        }}
                ]
            },
            {
                role: 'window',
                submenu: [
                    {role: 'minimize'},
                    {role: 'close'}
                ]
            },
            {
                role: 'help',
                submenu: [
                    {
                        label: 'Learn More',
                        click() { require('electron').shell.openExternal('https://electronjs.org'); }
                    }
                ]
            }
        ];

        const menu = Menu.buildFromTemplate(template);
        Menu.setApplicationMenu(menu);

        // show whole menu on right click
        window.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            menu.popup(remote.getCurrentWindow());
        }, false);
    }

    componentWillReceiveNextProps() {
        console.log(remote);
        let currentMenu = remote.Menu.getApplicationMenu();
        currentMenu.menu[2].submenu.push(
            {labe: 'why why'}
        );
        Menu.setApplicationMenu(currentMenu);
    }

    handleToggleSettingsModal() {
        console.log(this.props.settingsModalVisible);
        this.props.onToggleSettingsModal();
    }

    openDialog() {
        console.log("this is a test");
        const menu = new Menu();
        menu.append(new MenuItem({label: 'MenuItem1', click() { console.log('item 1 clicked'); }}));
        menu.append(new MenuItem({type: 'separator'}));
        menu.append(new MenuItem({label: 'MenuItem2', type: 'checkbox', checked: true}));
        menu.popup(remote.getCurrentWindow());
    }

    handleFormSubmit(e) {
        e.preventDefault();
        console.log(e.target.value);
    }

    render() {
        let settingsModal = null;
        let canvasSettings =
            <div>
                <label>Width:</label><input />
                <label>Height:</label><input />
                <input type="submit" value="Submit" id="basic-button" />
                <button id="basic-button" onClick={this.handleToggleSettingsModal}>Cancel</button>
            </div>;
        if (this.props.settingsModalVisible) {
            settingsModal = <div>
                <Modal formContent={canvasSettings} formValues={{canvasWidth: 50, canvasHeight: 50}} modalName="Canvas Settings" /></div>;
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

export default ElectronMenu;
