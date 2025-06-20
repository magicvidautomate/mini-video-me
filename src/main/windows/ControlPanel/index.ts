import { nativeImage } from 'electron'
import { join } from 'path'

import { createWindow } from 'main/factories'
import { ENVIRONMENT, PLATFORM } from 'shared/constants'
import { APP_CONFIG } from '~/app.config'

const { TITLE } = APP_CONFIG

export async function ControlPanelWindow() {
  const controlPanelWindow = createWindow({
    id: 'control-panel',
    title: `${TITLE} - Controls`,
    width: 320,
    height: 480,
    minWidth: 280,
    minHeight: 400,
    maxWidth: 400,
    maxHeight: 600,
    frame: true,
    center: false,
    resizable: true,
    transparent: false,
    alwaysOnTop: true,
    maximizable: false,
    minimizable: true,
    closable: true,
    hasShadow: true,
    titleBarStyle: 'default',
    x: 100,
    y: 100,

    icon: nativeImage.createFromPath(
      join(__dirname, 'resources', 'icons', 'icon.png')
    ),

    webPreferences: {
      spellcheck: false,
      nodeIntegration: false,
      contextIsolation: true,
      preload: join(__dirname, 'bridge.js'),
    },
  })

  // Load the control panel specific page
  if (ENVIRONMENT.IS_DEV) {
    controlPanelWindow.loadURL('http://localhost:4927/control-panel.html')
  } else {
    controlPanelWindow.loadFile(join(__dirname, 'control-panel.html'))
  }

  ENVIRONMENT.IS_DEV &&
    controlPanelWindow.webContents.openDevTools({ mode: 'detach' })

  controlPanelWindow.setAlwaysOnTop(true, 'floating')

  controlPanelWindow.setVisibleOnAllWorkspaces(true, {
    visibleOnFullScreen: true,
  })

  // Position the control panel window to the left of the main window
  controlPanelWindow.on('ready-to-show', () => {
    const bounds = controlPanelWindow.getBounds()
    controlPanelWindow.setPosition(bounds.x - 50, bounds.y + 50)
  })

  return controlPanelWindow
}
