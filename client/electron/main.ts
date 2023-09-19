/* eslint-disable @typescript-eslint/no-explicit-any */
'use strict';

const { app, ipcMain, BrowserWindow } = require('electron');

import path from 'node:path'

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// 

process.env.DIST = path.join(__dirname, '../dist')
process.env.PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')


let win: typeof BrowserWindow | null
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    width: 1366,
    height: 768,
    autoHideMenuBar: true,
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  //win.webContents.openDevTools();

  win.maximize();

  // win.webContents.print({silent: true, printBackground: false, deviceName: 'Microsoft Print to PDF'});

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(process.env.DIST, 'index.html'))
  }
}

app.on('window-all-closed', () => {
  win = null
})

app.whenReady().then(createWindow)

const printOptions = {
  silent: true,
  printBackground: true,
  color: true,
  margin: {
    marginType: 'printableArea',
  },
  landscape: false,
  pagesPerSheet: 1,
  collate: false,
  copies: 2,
  header: 'Page header',
  footer: 'Page footer',
};

const printOption2 = {
  silent: true,
  printBackground: true,
  color: true,
  margin: {
    marginType: 'printableArea',
  },
  landscape: false,
  pagesPerSheet: 1,
  collate: false,
  copies: 1,
  header: 'Page header',
  footer: 'Page footer',
};

//handle print
ipcMain.handle('printComponent', (_event: any, url: any) => {
  const win = new BrowserWindow({ show: false });

  win.loadURL(url);

  win.webContents.on('did-finish-load', () => {
    win.webContents.print(printOptions, (success: any, failureReason: any) => {
      console.log('Print Initiated in Main...');
      if (!success) console.log(failureReason);
    });
  });
  return 'shown print dialog';
});


//handle print
ipcMain.handle('printComponent1', (_event: any, url: any) => {
  const win = new BrowserWindow({ show: false });

  win.loadURL(url);

  win.webContents.on('did-finish-load', () => {
    win.webContents.print(printOption2, (success: any, failureReason: any) => {
      console.log('Print Initiated in Main...');
      if (!success) console.log(failureReason);
    });
  });
  return 'shown print dialog';
});



//handle preview
ipcMain.handle('previewComponent', (_event: any, url: any) => {
  let win = new BrowserWindow({ title: 'Preview', show: false, autoHideMenuBar: true });
  win.loadURL(url);

  win.webContents.once('did-finish-load', () => {
    win.webContents.printToPDF(printOptions).then((data: any) => {
      const buf = Buffer.from(data);
      const _data = buf.toString('base64');
      const url = 'data:application/pdf;base64,' + _data;
      win.webContents.on('ready-to-show', () => {
        win.show();
        win.setTitle('Preview');
      });

      win.webContents.on('closed', () => win = null);
      win.loadURL(url);
    })
      .catch((error: any) => {
        console.log(error);
      });
  });
  return 'shown preview window';
});

