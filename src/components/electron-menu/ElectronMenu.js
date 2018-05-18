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
        onRedoClick: PropTypes.func,
        onFileSave: PropTypes.func,
        onFileOpen: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.openDialog = this.openDialog.bind(this);
        this.handleToggleSettingsModal = this.handleToggleSettingsModal.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);

        this.handleZoomIn = this.handleZoomIn.bind(this);
        this.handleZoomOut = this.handleZoomOut.bind(this);
        this.handleSelectRotateTool = this.handleSelectRotateTool.bind(this);
        this.handleFileSave = this.handleFileSave.bind(this);
        this.handleFileOpen = this.handleFileOpen.bind(this);
    }

    handleZoomIn() {
        this.props.onSetCustomZoom(this.props.scale * 2);
    }

    handleZoomOut() {
        this.props.onSetCustomZoom(this.props.scale / 2);
    }

    handleSelectRotateTool() {
        this.props.onToolSelect("rotateTool");
    }

    handleFileSave(event) {
        this.props.onFileSave(event);
    }

    handleFileOpen(data) {
        this.props.onFileOpen(data);
    }

    callMenuFunction(fn) {
        if (document.activeElement.className !== 'input' && document.activeElement.className !== 'notranslate public-DraftEditor-content') {
            fn();
        }
    }

    componentDidMount() {
        const template = [
            {label: 'DartDraw'},
            {label: 'File',
                submenu: [
                    {label: 'Save',
                        click: () => {
                            this.handleFileSave();
                        }},
                    {label: 'Open',
                        click: () => {

                        }},
                    {label: 'New',
                        click: () => {

                        }}
                ]},
            {
                label: 'Edit',
                submenu: [
                    {role: 'undo', click: () => { this.callMenuFunction(this.props.onUndoClick); }},
                    {role: 'redo', click: () => { this.callMenuFunction(this.props.onRedoClick); }},
                    {type: 'separator'},
                    {role: 'cut'},
                    {role: 'copy'},
                    {role: 'paste'},
                    {label: 'Clear'},
                    {type: 'separator'},
                    {label: 'Duplicate', accelerator: 'CmdOrCtrl+D'},
                    {label: 'Delete', accelerator: 'Backspace', click: () => { console.log("deleting a shape"); }},
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
                    {label: 'Toggle Rulers', click: () => { this.callMenuFunction(this.props.onShowRulers); }},
                    {label: 'Toggle Gridlines', click: () => { this.callMenuFunction(this.props.onShowGrid); }},
                    {label: 'Toggle Grid Subdivisions', click: () => { this.callMenuFunction(this.props.onShowSubDivisions); }},
                    {type: 'separator'},
                    {role: 'reload'},
                    {role: 'forcereload'},
                    {role: 'toggledevtools'},
                    {type: 'separator'},
                    {role: 'resetzoom'},
                    {role: 'zoomin', click: () => { this.callMenuFunction(this.handleZoomIn); }},
                    {role: 'zoomout', click: () => { this.callMenuFunction(this.handleZoomOut); }},
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
                label: 'Text',
                submenu: [
                    {label: 'Bold', accelerator: 'CmdOrCtrl+B'},
                    {label: 'Underline', accelerator: 'CmdOrCtrl+U'},
                    {label: 'Italicize', accelerator: 'CmdOrCtrl+I'},
                    {type: 'separator'},
                    {label: 'Left', accelerator: 'CmdOrCtrl+['},
                    {label: 'Right', accelerator: 'CmdOrCtrl+]'},
                    {label: 'Center', accelerator: 'CmdOrCtrl+\\'},
                    {label: 'Justified', accelerator: 'Shift+CmdOrCtrl+\\'},
                    {type: 'separator'},
                    {label: 'Superscript', accelerator: 'Ctrl+Plus'},
                    {label: 'Subscript', accelerator: 'Ctrl+-'}
                ]
            },
            {
                label: 'Arrange',
                submenu: [
                    {label: 'Move Forward', accelerator: 'CmdOrCtrl+F', click: () => { this.callMenuFunction(this.props.onMoveForward); }},
                    {label: 'Move To Front', accelerator: 'CmdOrCtrl+Shift+F', click: () => { this.callMenuFunction(this.props.onBringToFront); }},
                    {label: 'Move Backward', accelerator: 'CmdOrCtrl+J', click: () => { this.callMenuFunction(this.props.onMoveBackward); }},
                    {label: 'Move To Back', accelerator: 'CmdOrCtrl+Shift+J', click: () => { this.callMenuFunction(this.props.onSendToBack); }},
                    {type: 'separator'},
                    {label: 'Align', accelerator: 'CmdOrCtrl+K'},
                    {label: 'Alignment', accelerator: 'CmdOrCtrl+Shift+K'},
                    {type: 'separator'},
                    {label: 'Rotate', accelerator: 'CmdOrCtrl+T', click: () => { this.callMenuFunction(this.handleSelectRotateTool); }},
                    {label: 'Flip Horizontal', click: () => { this.callMenuFunction(this.props.onFlipHorizontal); }},
                    {label: 'Flip Vertical', click: () => { this.callMenuFunction(this.props.onFlipVertical); }},
                    {label: 'Scale Selection...'},
                    {type: 'separator'},
                    {label: 'Group', accelerator: 'CmdOrCtrl+G', click: () => { this.callMenuFunction(this.props.onGroupClick); }},
                    {label: 'Ungroup', accelerator: 'CmdOrCtrl+Shift+G', click: () => { this.callMenuFunction(this.props.onUngroupClick); }},
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

    handleToggleSettingsModal() {
        this.props.onToggleSettingsModal();
    }

    openDialog() {
        const menu = new Menu();
        menu.append(new MenuItem({label: 'MenuItem1', click() { console.log('item 1 clicked'); }}));
        menu.append(new MenuItem({type: 'separator'}));
        menu.append(new MenuItem({label: 'MenuItem2', type: 'checkbox', checked: true}));
        menu.popup(remote.getCurrentWindow());
    }

    handleFormSubmit(e) {
        e.preventDefault();
    }

    render() {
        return (
            <div />
        );
    }
}

export default ElectronMenu;
