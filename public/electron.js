const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const indexPath = path.resolve(path.join(process.cwd(), 'build', 'index.html'));

let mainWindow;

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 900,
		height: 680,
		webPreferences: { nodeIntegration: true, sandbox: false },
	});
	// mainWindow.loadURL(
	//   isDev
	//     ? 'http://localhost:3000'
	//     : `file://${path.join(__dirname, '../build/index.html')}`
	// );

	mainWindow.loadFile(indexPath);
	if (isDev) {
		// Open the DevTools.
		//BrowserWindow.addDevToolsExtension('<location to your react chrome extension>');
		mainWindow.webContents.openDevTools();
	}
	mainWindow.on('closed', () => (mainWindow = null));
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
