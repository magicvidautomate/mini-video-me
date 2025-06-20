import { ipcRenderer } from 'electron'
import { IPC } from 'shared/constants'

export async function startRecording() {
  return await ipcRenderer.invoke(IPC.RECORDING.START)
}

export async function stopRecording() {
  return await ipcRenderer.invoke(IPC.RECORDING.STOP)
}

export async function getRecordingStatus() {
  return await ipcRenderer.invoke(IPC.RECORDING.STATUS)
}

export async function getSavePath() {
  return await ipcRenderer.invoke(IPC.RECORDING.SAVE_PATH)
}

export function onRecordingToggleRequested(callback: () => void) {
  ipcRenderer.on('recording:toggle-requested', callback)
}

export function removeRecordingToggleListener(callback: () => void) {
  ipcRenderer.removeListener('recording:toggle-requested', callback)
}
