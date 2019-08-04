const { app, BrowserWindow, Menu, ipcMain, shell } = require('electron');
const package = require('../package');
const path = require('path');
const template = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Open',
        accelerator: 'CmdOrCtrl+O',
        role: 'open'
      },
      {
        label: 'Save',
        accelerator: 'CmdOrCtrl+S',
        role: 'save'
      }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      {
        label: 'Undo',
        accelerator: 'CmdOrCtrl+Z',
        role: 'undo'
      },
      {
        label: 'Redo',
        accelerator: 'Shift+CmdOrCtrl+Z',
        role: 'redo'
      },
      {
        type: 'separator'
      },
      {
        label: 'Cut',
        accelerator: 'CmdOrCtrl+X',
        role: 'cut'
      },
      {
        label: 'Copy',
        accelerator: 'CmdOrCtrl+C',
        role: 'copy'
      },
      {
        label: 'Paste',
        accelerator: 'CmdOrCtrl+V',
        role: 'paste'
      },
      {
        label: 'Select All',
        accelerator: 'CmdOrCtrl+A',
        role: 'selectall'
      },
    ]
  }
];

if (process.platform == 'darwin') {
  var name = app.getName();
  template.unshift({
    label: name,
    submenu: [
      {
        label: 'About ' + name,
        role: 'about'
      },
      {
        type: 'separator'
      },
      {
        label: 'Services',
        role: 'services',
        submenu: []
      },
      {
        type: 'separator'
      },
      {
        label: 'Hide ' + name,
        accelerator: 'Command+H',
        role: 'hide'
      },
      {
        label: 'Hide Others',
        accelerator: 'Command+Alt+H',
        role: 'hideothers'
      },
      {
        label: 'Show All',
        role: 'unhide'
      },
      {
        type: 'separator'
      },
      {
        label: 'Quit',
        accelerator: 'Command+Q',
        click() { app.quit(); }
      },
    ]
  });
}
// Menu.setApplicationMenu(Menu.buildFromTemplate(template));

let mainWindow;
let splashWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 720,
    minHeight: 600,
    minWidth: 800,
    backgroundColor: '#474747',
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true
    }
  });
  // mainWindow.webContents.openDevTools();
  mainWindow.loadURL(`file://${path.join(__dirname, '../public/index.html')}`);
  mainWindow.on('closed', () => mainWindow = null);
  mainWindow.on('message', () => console.log("ddd"));
  mainWindow.setAutoHideMenuBar(true);
  mainWindow.hide();
}

function createSplashWindow() {
  splashWindow = new BrowserWindow({
    width: 500, height: 400, titleBarStyle: 'hide',
    transparent: true,
    frame: false,
    resizable: false,
    alwaysOnTop: true,
    visibleOnAllWorkspaces: true,
    show: false,
    autoHideMenuBar: true,
  });
  splashWindow.loadURL(`file://${path.join(__dirname, '../public/splash.html')}`);
  splashWindow.on('closed', () => splashWindow = null);
  splashWindow.once('ready-to-show', () => {
    splashWindow.show()
  })
}

function onCreate() {
  createWindow();
  createSplashWindow();
}

ipcMain.on("ps", function (message, arg) {
  if(arg === "done" && splashWindow != null) {
    splashWindow.close();
    setTimeout(() => {
      mainWindow.show();
    }, 200)
  }
});
app.commandLine.appendSwitch('js-flags', '--max-old-space-size=4096')
app.on('ready', onCreate);

app.on('window-all-closed', () => {
  // if (process.platform !== 'darwin') {
  app.quit();
  // }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
  mainWindow.show();
});
