const electron = require('electron');
const package = require('../package');
const path = require('path')
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const menu = electron.Menu;
// menu.setApplicationMenu(menu.buildFromTemplate([
//   {
//     label: 'Edit',
//     submenu: [
//       { role: 'undo' },
//       { role: 'redo' },
//       { type: 'separator' },
//       { role: 'cut' },
//       { role: 'copy' },
//       { role: 'paste' },
//       { role: 'delete' },
//       { role: 'selectall' }
//     ]
//   },
//   {
//     label: 'Help',
//     role: 'help',
//     submenu: [
//       {
//         label: 'Submit feedback...',
//         click: function () {
//           electron.shell.openExternal(package.bugs.url);
//         }
//       },
//       {
//         role: 'about',
//       },
//     ]
//   }
// ]));

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({ width: 1024, height: 768 });
  mainWindow.webContents.openDevTools();
  mainWindow.loadURL(`file://${path.join(__dirname, '../public/index.html')}`);
  mainWindow.on('closed', () => mainWindow = null);
  mainWindow.setAutoHideMenuBar(true);
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
