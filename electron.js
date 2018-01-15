const electron = require('electron');
const { app, Menu, MenuItem, BrowserWindow, dialog, ipcMain} = require('electron');

// Module to create handle file management
const fs = require('fs');

// Module to handle window management
const windowManager = require('electron-window-manager');
var numWindows = 0;
var windowNameStart = 'Window #';

const template = [
    {
        label: 'File',
        submenu: [
            {type: 'separator'},
            {role: 'cut'},
            {role: 'copy'},
            {role: 'paste'},
            {role: 'pasteandmatchstyle'},
            {role: 'delete'},
            {role: 'selectall'},
            {
                label: 'Save', 
                click() {
                    let win = windowManager.getCurrent();
                    dialog.showSaveDialog(function (filename) {
                        win.object.send('file-save', 'writing to file');
                        ipcMain.on('file-save', (event, stateString) => {
                            fs.writeFile(filename, stateString, (err) => {
                                if(err){
                                    alert("An error ocurred creating the file "+ err.message)
                                } else {
                                    alert("The file has been succesfully saved");
                                }
                            });
                        });
                    });
                }
            },
            {
                label: 'Open', 
                click() {
                    dialog.showOpenDialog(function (filenames) {
                        if (filenames[0] === null) {
                            return;
                        } else {
                            let win;
                            for (filename in filenames) {
                                win = createWindow();
                                win.once('ready-to-show', () => {
                                    fs.readFile(filename, (err, data) => {
                                        win.object.send('file-open', data);
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
        label: 'Edit',
        submenu: [
            {role: 'undo'},
            {role: 'redo'},
            {type: 'separator'},
            {role: 'cut'},
            {role: 'copy'},
            {role: 'paste'},
            {role: 'pasteandmatchstyle'},
            {role: 'delete'},
            {role: 'selectall'}
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
                click() { require('electron').shell.openExternal('https://electron.atom.io'); }
            }
        ]
    }
];

if (process.platform === 'darwin') {
    template.unshift({
        label: app.getName(),
        submenu: [
            {role: 'about'},
            {type: 'separator'},
            {role: 'services', submenu: []},
            {type: 'separator'},
            {role: 'hide'},
            {role: 'hideothers'},
            {role: 'unhide'},
            {type: 'separator'},
            {role: 'quit'}
        ]
    });

    // Edit menu
    template[1].submenu.push(
        {type: 'separator'},
        {
            label: 'Speech',
            submenu: [
                {role: 'startspeaking'},
                {role: 'stopspeaking'},
                {role: 'stopspeaking'}
            ]
        }
    );

    // Window menu
    template[3].submenu = [
        {role: 'close'},
        {role: 'minimize'},
        {role: 'zoom'},
        {type: 'separator'},
        {role: 'front'}
    ];
}

let canvasColor = '#ffffff';
const canvasItem = new MenuItem(
    {label: 'Canvas',
        submenu: [
            {label: 'Background Color',
                submenu: [
                    {label: 'Black',
                        click() {
                            canvasColor = '#000000';
                            windowManager.getCurrent().object.send('canvasColorChange', 'black');
                            
                            // testWin = new BrowserWindow({width: 800, height: 600});
                            // testWin.focus();

                            // // and load the index.html of the app.
                            // testWin.loadURL('http://localhost:3000');

                            // // Open the DevTools.
                            // testWin.webContents.openDevTools();

                            // testWin.on('did-finish-load', () => {
                            //     testWin.webContents.send('loaded-from-file', 'hello!!!');
                            // });

                            // // Emitted when the window is closed.
                            // testWin.on('closed', function() {
                            //     // Dereference the window object, usually you would store windows
                            //     // in an array if your app supports multi windows, this is the time
                            //     // when you should delete the corresponding element.
                            //     testWin = null;
                            // });
                            // ipcMain.on('loaded-from-file', (event, arg) => {
                            //     console.log(arg);
                            // });
                        }},
                    {label: 'White',
                        click() {
                            canvasColor = '#ffffff';
                            windowManager.getCurrent().object.send('canvasColorChange', 'white');
                            // var secondaryWindow = new BrowserWindow({width: 800, height: 600});
                            // secondaryWindow.focus();

                            // // and load the index.html of the app.
                            // secondaryWindow.loadURL('http://localhost:3000');

                            // // Open the DevTools.
                            // secondaryWindow.webContents.openDevTools();

                            // // Emitted when the window is closed.
                            // secondaryWindow.on('closed', function() {
                            //     // Dereference the window object, usually you would store windows
                            //     // in an array if your app supports multi windows, this is the time
                            //     // when you should delete the corresponding element.
                            //     secondaryWindow = null;
                            // });
                        }},
                    {type: 'separator'},
                    {label: 'Custom...'}
                ]},
            {label: 'Resize Canvas'}
        ]}
);

function createWindow() {
    // Create the browser window.
    numWindows++;
    var windowName = windowNameStart.concat(String(numWindows));
    var newWindow = windowManager.createNew(windowName, windowName, 'http://localhost:3000', {width: 800, height: 600}, null, true);
    
    newWindow.open();
   
    // and load the index.html of the app.
    newWindow.loadURL('http://localhost:3000');

    // Emitted when the window is closed.
    newWindow.object.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        newWindow = null;
    });

    return newWindow;
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function() {
    createWindow();
    const menu = Menu.buildFromTemplate(template);
    menu.insert(2, canvasItem);
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
    if (windowManager.windows[0] === null) {
        createWindow();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.