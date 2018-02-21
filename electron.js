const electron = require('electron');

// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;
// Enables addition of menus and menu items
const Menu = electron.Menu;
const MenuItem = electron.MenuItem;
// For save and open dialogs
const dialog = electron.dialog;
// Module to create handle file management
const fs = require('fs');
// For inter-process communication (file save, file open, canvas color change)
ipcMain = electron.ipcMain;

const template = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Save',
                click() {
                    let win = BrowserWindow.getFocusedWindow();
                    if (win == null) return;
                    dialog.showSaveDialog(function(filename) {
                        win.webContents.send('file-save', 'writing to file');
                        ipcMain.on('file-save', (event, stateString) => {
                            fs.writeFile(filename, stateString, (err) => {
                                if (err) {
                                    let message = "An error ocurred creating the file " + err.message;
                                    win.webContents.send('error', message);
                                } else {
                                    win.webContents.send('alert', 'The file has been successfully saved');
                                }
                            });
                        });
                    });
                }
            },
            {
                label: 'Open',
                click() {
                    dialog.showOpenDialog(function(filenames) {
                        if (filenames[0] === null) {

                        } else {
                            let win;
                            var numFiles = filenames.length;
                            for (var i = 0; i < numFiles; i++) {
                                let filename = filenames[i];
                                win = createWindow();
                                win.webContents.on('dom-ready', () => {
                                    fs.readFile(filename, 'utf8', (err, data) => {
                                        win.webContents.send('file-open', data);
                                    });
                                });
                            }
                        }
                    });
                }
            },
            {
                label: 'New',
                click() {
                    createWindow();
                }
            }
        ]
    },
    {
        label: 'View',
        submenu: [
            {role: 'reload'},
            {role: 'forcereload'},
            {role: 'toggledevtools'},
            {type: 'separator'},
            {role: 'resetzoom'},
            {role: 'zoomin'},
            {role: 'zoomout'},
            {type: 'separator'},
            {role: 'togglefullscreen'}
        ]
    },
    {
        label: 'File',
        submenu: [
            {label: 'New',
                click() {
                    createWindow();
                }},
            {role: 'Save'},
            {
                label: 'Open',
                click() {
                    dialog.showOpenDialog(function(filenames) {
                        if (filenames[0] === null) {

                        } else {
                            let win;
                            var numFiles = filenames.length;
                            for (var i = 0; i < numFiles; i++) {
                                let filename = filenames[i];
                                win = createWindow();
                                win.webContents.on('dom-ready', () => {
                                    fs.readFile(filename, 'utf8', (err, data) => {
                                        win.webContents.send('file-open', data);
                                    });
                                });
                            }
                        }
                    });
                }
            }
        ]
    },
    {
        label: 'Settings',
        submenu: [
            {label: 'Ruler Settings',
                click() {
                    openRulerSettings();
                }},
            {label: 'Canvas Settings',
                click() {
                    openRulerSettings1();
                }}
        ]
    }
];

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let windows = [];

function createWindow() {
    // Create the browser window.
    let win = new BrowserWindow({width: 800, height: 600});
    windows.push(win);
    win.focus();

    // and load the index.html of the app.
    win.loadURL('http://localhost:3000');

    // Emitted when the window is closed.
    win.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
    });

    return win;
}

function openRulerSettings() {
    dialog.showMessageBox({ message: "These are all the ruler settings",
        checkboxLabel: 'test',
        buttons: ["OK", "change background color "]});
}

function openRulerSettings1() {
    dialog.showMessageBox({browserWindow: './ruler_settings.html'});
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function() {
    createWindow();
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
});

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function() {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (windows.length == 0) {
        createWindow();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
