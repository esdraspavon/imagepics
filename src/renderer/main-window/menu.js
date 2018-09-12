import { remote } from 'electron'
import { openDirectory, saveFile, openPreferences, pasteImage } from './ipcRendererEvents'
import { print } from './images-ui'

function createMenu () {
	const template = [
		{
			label: 'Archivo',
			submenu: [
				{
					label: 'Abrir ubicación',
					accelerator: 'CmdOrCtrl+O',
					click () { openDirectory() }
				},
				{
					label: 'Guardar',
					accelerator: 'CmdOrCtrl+G',
					click () { saveFile() }
				},
				{
					label: 'Preferencias',
					accelerator: 'CmdOrCtrl+,',
					click () { openPreferences() }
				},
				{
					label: 'Cerrar',
					role: 'quit'
				}
			]
		},
		{
			label: 'Edición',
			submenu: [
				{
					label: 'Pegar imagen',
					accelerator: 'CmdOrCtrl+I',
					click () { pasteImage() }
				},
				{
					label: 'Imprimir',
					accelerator: 'CmdOrCtrl+P',
					click () { print() }
				}
			]
		}
	]

	const menu = remote.Menu.buildFromTemplate(template)
	remote.Menu.setApplicationMenu(menu)
}
module.exports = createMenu