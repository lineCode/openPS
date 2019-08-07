const { app, BrowserWindow, Menu, ipcMain, shell, Tray, nativeImage } = require('electron');
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
        click() {
          app.quit();
        }
      },
    ]
  });
}
// Menu.setApplicationMenu(Menu.buildFromTemplate(template));

let mainWindow;
let splashWindow;
let tray;

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

function showMainWindow() {
  if (mainWindow === null) {
    createWindow();
  }
  mainWindow.show();
  mainWindow.focus();
}

ipcMain.on("ps", function (message, arg) {
  if (arg === "done" && splashWindow != null) {
    splashWindow.close();
    setTimeout(() => {
      mainWindow.show();
      let image = nativeImage.createFromPath(path.join(__dirname, 'images/icon@2x.png'));
      tray = new Tray(image);
      const contextMenu = Menu.buildFromTemplate([
        {
          label: '显示窗口', click() {
            showMainWindow();
          }
        },
        {
          label: '退出', click() {
            app.quit();
          }
        },
      ]);
      tray.setContextMenu(contextMenu);
      // tray.on('click', () => {
      //
      // })
    }, 400)
  }
});

ipcMain.on('get-file-data', function (event) {
  var data = null
  if (process.platform == 'win32' && process.argv.length >= 2) {
    var openFilePath = process.argv[1]
    data = openFilePath
  }
  console.log(data);
  event.returnValue = data
});

app.commandLine.appendSwitch('js-flags', '--max-old-space-size=4096')
app.on('ready', onCreate);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  showMainWindow();
});
