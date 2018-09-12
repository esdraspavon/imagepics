import { ipcRenderer, clipboard, remote } from 'electron'
import settings from 'electron-settings'
import { addImageEvents, clearImages, loadImages, selectFirstImage } from './images-ui'
import path from 'path'
import { saveImage } from './filters'
import os from 'os'

function setIpc () {
	if (settings.has('directory')) {
		ipcRenderer.send('load-directory', settings.get('directory'))
	}
	ipcRenderer.on('load-images', (event, dir, images) => {
		clearImages()
		loadImages(images)
		addImageEvents()
		selectFirstImage()
		settings.set('directory', dir)
		document.getElementById('directory').innerHTML= dir
	})
	ipcRenderer.on('save-image', (event, file) => {
		saveImage(file, (err) => {
			if (err) 	return showDialog('error', 'Imagepics', err.message)
				//const notify = new Notification('Imagepics', {
				//	body: 'La imagen fue guardada!'
					//silent: false
				//})
			//notify.onclick = () => {

			//}
			showDialog('info', 'Imagepics', 'La imagen fue guardada!')
		})
	})
}

function openPreferences () {
	const BrowserWindow = remote.BrowserWindow
	const mainWindow = remote.getGlobal('win')

	const preferencesWindow = new BrowserWindow({
		width: 400,
		height: 300,
		title: 'Preferencias',
		center: true,
		modal: true,
		frame: false,
		show: false
	})
	if (os.platform() !== 'win32') {	
		preferencesWindow.setParentWindow(mainWindow)
	}
	preferencesWindow.once('ready-to-show', () => {
		preferencesWindow.show()
		preferencesWindow.focus()
	})
	preferencesWindow.loadURL(`file://${path.join(__dirname, '..')}/preferences.html`)
}

function openDirectory() {
	ipcRenderer.send('open-directory')
}
function showDialog (type, title, msg) {
	ipcRenderer.send('show-dialog', { type: type, title: title, message: msg})
}

function saveFile() {
	const image = document.getElementById('image-displayed').dataset.original
	let ext
	  // Si es una imagen serializa en png base64
	  if (image.indexOf('data:image/png;base64') !== -1)  {
	    ext=".png"
	  } else {
	    // Obtener la extensión del archivo para
	    // filtrar el cuadro de diálogo
	    ext = path.extname(image)
	  }
	ipcRenderer.send('open-save-dialog', ext)
}

function pasteImage () {
	const image = clipboard.readImage()
	const data = image.toDataURL()
	if (data.indexOf('data:image/png;base64') !== -1 && !image.isEmpty()) {
		let mainImage = document.getElementById('image-displayed')
		mainImage.src = data
		mainImage.dataset.original = data
	} else {
		showDialog('error', 'Imagepics', 'No hay una imagen valida en el portapapeles')
	}
}

module.exports = {
	setIpc: setIpc,
	saveFile: saveFile,
	openDirectory: openDirectory,
	openPreferences: openPreferences,
	pasteImage: pasteImage
}