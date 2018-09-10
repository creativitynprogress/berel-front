const { app, BrowserWindow } = require('electron');
const path = require('path')
const url = require('url')
//var _app = require('app');

let win;

function createWindow() {

  // Create the browser window.
  win = new BrowserWindow({

  });


  /* win.loadURL(url.format({
    pathname: path.join(__dirname, 'dist/index.html'),
    protocol: 'file:',
    slashes: true
  })); */

  win.loadFile('dist/index.html')

  //win.webContents.openDevTools();
  win.setMenu(null);
  win.maximize();

  win.on('closed', () => {
    win = null;
  });
}

  app.on('ready', createWindow);

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    if (win === null) {
      createWindow();
    }
  });


