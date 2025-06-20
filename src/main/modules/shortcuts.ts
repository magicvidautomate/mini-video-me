import { globalShortcut, BrowserWindow } from 'electron'

import { userPreferences } from 'shared/store'
import { getVirtualState } from './state'
import { updateMenu } from './menu'

export function loadShortcutsModule() {
  const { screen } = getVirtualState()

  const { moveCamera, resizeCamera, hideCamera, recording } =
    userPreferences.store.shortcuts

  screen.moveWindowToScreenEdge()

  globalShortcut.register(moveCamera.up, () => {
    screen.moveWindowToScreenEdge(screen.calculateScreenMovement('top'))
    updateMenu()
  })

  globalShortcut.register(moveCamera.down, () => {
    screen.moveWindowToScreenEdge(screen.calculateScreenMovement('bottom'))
    updateMenu()
  })

  globalShortcut.register(moveCamera.left, () => {
    screen.moveWindowToScreenEdge(screen.calculateScreenMovement('left'))
    updateMenu()
  })

  globalShortcut.register(moveCamera.right, () => {
    screen.moveWindowToScreenEdge(screen.calculateScreenMovement('right'))
    updateMenu()
  })

  globalShortcut.register(resizeCamera.toggle, () => {
    screen.toggleWindowSize()
  })

  globalShortcut.register(hideCamera, () => {
    screen.toggleWindowVisibility()
  })

  globalShortcut.register(recording.toggle, () => {
    // Send IPC message to renderer to toggle recording
    const mainWindow = BrowserWindow.getAllWindows()[0]
    if (mainWindow) {
      mainWindow.webContents.send('recording:toggle-requested')
    }
  })
}
