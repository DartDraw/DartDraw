const electron = require('electron');

// Module to control application life.
// const app = require('app');
const { app, Menu, MenuItem, ipcMain } = require('electron');
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const dialog = electron.dialog;
const fs = require('fs');


let ready = false;
ipcMain.on('async', (event, arg) => {
    ready = arg;
});

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
                label: 'save', 
                click() {
                    dialog.showSaveDialog(function (filename) {
                        mainWindow.send('file-save', 'writing to file');
                        ipcMain.on('file-save', (event, stateString) => {
                            console.log(stateString)
                            fs.writeFile(filename, stateString, (err) => {
                                if(err){
                                    mainWindow.send('alert', 'An error ocurred creating the file '+ err.message);
                                }
                                            
                                mainWindow.send('alert', 'The file has been succesfully saved');
                            });
                        });
                    });
                }
            },
            {
                label: 'open', 
                click() {
                    console.log('opening file');
                    dialog.showOpenDialog(function (filenames) {
                        mainWindow.send('file-open', filenames[0]);
                    });
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
    // console.log("TEST");
    // console.log(template);
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
                            console.log('black');
                            mainWindow.send('async', 'black');
                            
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
                            console.log('white');
                            mainWindow.send('async', 'white');
                            // console.log('white');
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
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

let secondaryWindow;

function createSecondaryWindow() {
    // Create the browser window.
    secondaryWindow = new BrowserWindow({width: 800, height: 600});
    secondaryWindow.focus();

    // and load the index.html of the app.
    secondaryWindow.loadURL('http://localhost:3000');

    // Open the DevTools.
    // secondaryWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    secondaryWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        secondaryWindow = null;
    });

    // const menu = Menu.buildFromTemplate(template);
    // menu.insert(2, canvasItem);
    // console.log({menu});
    // Menu.setApplicationMenu(menu);
    // mainWindow.webContents.on('did-finish-load', () => {
    //     mainWindow.webContents.send('canvasColorChange', canvasColor);
    // });
    secondaryWindow.once('ready-to-show', () => {
        mainWindow.webContents.send('loaded-from-file', 'wahoo!');
    });
}

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({width: 800, height: 600});
    mainWindow.focus();
    console.log('Entered createWindow');

    // and load the index.html of the app.
    mainWindow.loadURL('http://localhost:3000');

    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });

    const menu = Menu.buildFromTemplate(template);
    menu.insert(2, canvasItem);
    // console.log({menu});
    Menu.setApplicationMenu(menu);
    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.send('canvasColorChange', canvasColor);
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

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
    if (mainWindow === null) {
        createWindow();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
