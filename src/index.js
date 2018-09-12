'use strict'
// instanciando los objetos app y rowserWindow
import { app, BrowserWindow, Tray, globalShortcut, protocol } from 'electron'
import devtools from './devtools'
import handleErrors from './handle-errors'
import setIpcMain from './ipcMainEvents'
import os from 'os'
import path from 'path'


global.win // eslint-disable-line
global.tray // eslint-disable-line

if (process.env.NODE_ENV === 'development') {
	devtools()
}

// console.dir(app); // muestra las propiedades de app

// Imprimiendo mensaje en consola antes de salir
app.on('before-quit', () => {
  globalShortcut.unregisterAll()
  console.log('saliendo')
})
// Ejecutando ordenes cuando la aplicacion esta lista
app.on('ready', () => {
  protocol.registerFileProtocol('imp', (request, callback) => {
      const url = request.url.substr(6)
      callback({path: path.normalize(url)}) // eslint-disable-line
    }, (error) => {
      if (error) throw error 
    })
  // creando una ventana
  global.win = new BrowserWindow({
    width: 1000,
    heiht: 800,
    title: 'Imagepics',
    center: true,
    maximizable: false,
    show: false,
    icon: path.join(__dirname, 'assets', 'icons', 'main-icon.png')
  }) // nos permite cargar el contenido visual de la aplicacion
  globalShortcut.register('CommandOrControl+Alt+P', () => {
    global.win.show()
    global.win.focus()
  })

  //Controlador de errores
  setIpcMain(global.win)
  handleErrors(global.win)

  // win.once se ejecuta una sola vez, win.on se ejecuta varias veces
  global.win.once('ready-to-show', () => {
    global.win.show()
  })
  // detecta cuando la ventana es movida
  global.win.on('move', () => {
    const position = win.getPosition()
    console.log(`la posicion es ${position}`)
  })

  // detectando el cierre de la ventana para cerrar la aplicacion
  global.win.on('closed', () => {
    global.win = null // para evitar que quede guardado en futuras sesiones
    app.quit()
  })

  //Definimos un iconno, dependiendo del SO
  let icon
  if (os.platform() == 'win32') {
    icon = path.join(__dirname, 'assets', 'icons', 'tray-icon.ico')
  } else {
    icon = path.join(__dirname, 'assets', 'icons', 'tray-icon.png')
  }

  global.tray = new Tray(icon)
  global.tray.setToolTip('Imagepics')

  //Evento click, en el icono del sistema
  global.tray.on('click', () => {
    //Oculta o muestra la ventana principal
    global.win.isVisible() ? global.win.hide() : global.win.show()
  })

  global.win.loadURL(`file://${__dirname}/renderer/index.html`)
  //global.win.toggleDevTools()
})
