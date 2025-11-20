/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use strict';

const { app, ipcMain, BrowserWindow, systemPreferences } = require('electron');

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

// Enable media device access
app.commandLine.appendSwitch('enable-features', 'GuestViewCrossProcessFrames');
app.commandLine.appendSwitch('enable-media-stream');
app.commandLine.appendSwitch('enable-usermedia-screen-capturing');
app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors');
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');
app.commandLine.appendSwitch('ignore-certificate-errors');

const gotTheLock = app.requestSingleInstanceLock();


let win: typeof BrowserWindow | null

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (win) {
      if (win.isMinimized()) win.restore()
      win.focus()
    }
  })
  // Create myWindow, load the rest of the app, etc...
  // app.on('ready', () => {
  //   createWindow()
  // })
  app.whenReady().then(async () => {
    // Request camera and microphone permissions
    if (process.platform === 'darwin') {
      // macOS
      const cameraStatus = systemPreferences.getMediaAccessStatus('camera');
      console.log('Camera access status:', cameraStatus);
      
      if (cameraStatus !== 'granted') {
        const granted = await systemPreferences.askForMediaAccess('camera');
        console.log('Camera permission granted:', granted);
      }
      
      const micStatus = systemPreferences.getMediaAccessStatus('microphone');
      if (micStatus !== 'granted') {
        await systemPreferences.askForMediaAccess('microphone');
      }
    } else if (process.platform === 'win32') {
      // Windows - check camera availability
      console.log('Windows platform - camera permissions managed by Windows Settings');
    }
    
    createWindow();
  });
}


function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false
    },
    width: 1366,
    height: 768,
    autoHideMenuBar: true,
    frame: true
  })

  // Handle permission requests - approve media access
  win.webContents.session.setPermissionRequestHandler((_webContents: any, permission: any, callback: any) => {
    console.log('Permission requested:', permission);
    callback(true);
  });

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
    
    // Test camera access and provide helpful error messages
    win?.webContents.executeJavaScript(`
      (async () => {
        try {
          // First, enumerate devices
          const devices = await navigator.mediaDevices.enumerateDevices();
          const cameras = devices.filter(d => d.kind === 'videoinput');
          console.log('Available cameras:', cameras.length, cameras);
          
          if (cameras.length === 0) {
            console.error('No cameras found. Please check if a camera is connected.');
          }
          
          // Try to get camera access
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { width: 1280, height: 720 }, 
            audio: false 
          });
          console.log('Camera access successful!', stream.getVideoTracks());
          stream.getTracks().forEach(track => track.stop()); // Stop the test stream
        } catch (err) {
          console.error('Camera access error:', err.name, err.message);
          if (err.name === 'NotAllowedError') {
            console.error('Permission denied. Please enable camera in Windows Settings > Privacy > Camera');
          } else if (err.name === 'NotFoundError') {
            console.error('No camera device found.');
          } else if (err.name === 'NotReadableError') {
            console.error('Camera is already in use by another application.');
          }
        }
      })();
    `);
  })

  win.webContents.openDevTools();

  win.maximize();

  // Emitted when the window is closed.
  win.on('closed', () => {
    win = null
  })

  win.loadURL("http://192.168.1.20:5173")
}


app.on('window-all-closed', () => {
  app.quit()
})

// app.whenReady().then(createWindow)

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
      win.close();
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
      win.close();
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



