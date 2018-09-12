import { app, dialog } from 'electron'

function relaunchApp (win) {
	dialog.showMessageBox(win, {
		type: 'error',
		title: 'Imagepic',
		message: 'Ocurrio un error inesperado, se reiniciara la aplicacion'
	}, () => {
		app.relaunch()
		app.exit(0)
	})
}

function setupErrors (win) {
	win.webContents.on('crashed', () => {
		relaunchApp(win)
	})
	win.on('unresponsive', () => {
		dialog.showMessageBox(win, {
		type: 'error',
		title: 'Imagepic',
		message: 'Un proceso esta tardando demasiado, puede esperar o reiniciar la aplicación manualmente'
		})
	})
	process.on('uncaughtException', () => {
		relaunchApp(win)
	})
}

module.exports = setupErrors