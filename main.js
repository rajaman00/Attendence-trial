// main.js
const { app, BrowserWindow, ipcMain, Menu } = require('electron');
let loginWindow, mainWindow;

// Create the login window
function createLoginWindow() {
  loginWindow = new BrowserWindow({
    width: 400,
    height: 300,
    resizable: false,
    frame: false, // Removes default window controls (optional)
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  loginWindow.loadFile('login.html');
}

// Create the main application window
function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadFile('index.html');

  // Build the custom menu
  const menuTemplate = [
    {
      label: 'Master',
      submenu: [
        {
          label: 'Designation Master',
          click: () => {
            // You can add functionality here to open a new window or load content in mainWindow
            mainWindow.loadFile('designation.html');
          }
        },
        {
          label: 'Employ Master',
          click: () => {
            mainWindow.webContents.send('menu-selection', 'employ');
          }
        },
        {
          label: 'Department Master',
          click: () => {
            mainWindow.loadFile('department.html');
          }
        }
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'About',
          click: () => {
            // Optionally implement an About dialog
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  // Close login window after login
  if (loginWindow) loginWindow.close();
}

// Handle login event from the login page
ipcMain.on('login', (event, credentials) => {
  const { username, password } = credentials;

  // Simple credential check (replace with real authentication logic)
  if (username === 'admin' && password === '1234') {
    createMainWindow(); // Open the main window on successful login
  } else {
    event.reply('login-failed', 'Invalid username or password!');
  }
});

// Initialize the application
app.whenReady().then(createLoginWindow);

// Quit when all windows are closed (except on macOS).
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Reopen window on macOS if app is still running
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createLoginWindow();
  }
});
