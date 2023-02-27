import {app, BrowserWindow, ipcMain, screen, session, Menu, nativeImage} from 'electron';
import * as path from 'path';
import * as fs from 'fs';

let win: BrowserWindow = null;
const args = process.argv.slice(1),
  serve = args.some(val => val === '--serve');

function createWindow(): BrowserWindow {

  const size = screen.getPrimaryDisplay().workAreaSize;
  app.commandLine.appendSwitch('server-path', 'https://meta-ml-server.metatest.de:8181');
  app.commandLine.appendSwitch('ignore-certificate-errors', 'true');
  session.defaultSession.allowNTLMCredentialsForDomains('*.metatest.de')

  // Create the browser window.
  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
    icon: "./src/assets/icons/CS_logo.png",
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: (serve),
      contextIsolation: false,  // false if you want to run e2e test with Spectron,
    },
  });

  win.webContents.openDevTools();


  if (serve) {
    const debug = require('electron-debug');
    debug();

    require('electron-reloader')(module);
    win.loadURL('http://localhost:4200');
  } else {
    // Path when running electron executable
    let pathIndex = './index.html';

    if (fs.existsSync(path.join(__dirname, '../dist/index.html'))) {
       // Path when running electron in local folder
      pathIndex = '../dist/index.html';
    }

    const url = new URL(path.join('file:', __dirname, pathIndex));
    win.loadURL(url.href);
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  const menu = Menu.buildFromTemplate([
    {
      label: 'Server',
      submenu: [
        {
          label: 'Go to localhost:4200',
          click: function() {
            win.loadURL('http://localhost:4200');
          },
        },
        {
          label: 'Load home page',
          click: function() {
            win.loadURL(new URL(path.join('file:', __dirname, '../dist/index.html')).href);
          },
        },
        {
          label: 'Quit',
          click: function() {
            app.quit();
          },
          accelerator: 'CmdOrCtrl+Q',
        },
      ],
    },
  ]);

  Menu.setApplicationMenu(menu);

  return win;
}

try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
  app.on('ready', () => setTimeout(() =>
  {
    createWindow();
  }, 400)
  );

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

} catch (e) {
  // Catch Error
  // throw e;
}
// console.log(win.webContents);
const serverPath = app.commandLine.getSwitchValue('server-path');

ipcMain.on("loadURL", (event, url) => {
  win.loadURL(url).then(() =>
  {
    console.log("success for " + url);
    win.webContents.send("message");
  }).catch(() => {
    console.log("error for " + url);
    // win.webContents.send("error", serverPath);
  })
});

ipcMain.handle('server-flag', async (event, args) => {
  return app.commandLine.getSwitchValue('server-path');
});

ipcMain.on("icon", (event, url, icon) => {
    let nativeImage1 = nativeImage.createFromDataURL(icon);
    win.setIcon(nativeImage1);
});



