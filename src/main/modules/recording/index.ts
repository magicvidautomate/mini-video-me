import { desktopCapturer, ipcMain, dialog } from 'electron'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { IPC } from 'shared/constants'

let isRecording = false
let mediaRecorder: any = null
let recordedChunks: Blob[] = []

export function loadRecordingModule() {
  ipcMain.handle(IPC.RECORDING.START, async () => {
    try {
      const sources = await desktopCapturer.getSources({
        types: ['screen', 'window'],
        thumbnailSize: { width: 1920, height: 1080 },
      })

      // For now, we'll use the first screen source
      // In the future, we can add a source selector
      const source =
        sources.find((source) => source.name === 'Entire Screen') || sources[0]

      if (!source) {
        throw new Error('No screen source available')
      }

      return {
        success: true,
        sourceId: source.id,
        sourceName: source.name,
      }
    } catch (error) {
      console.error('Failed to start recording:', error)
      return {
        success: false,
        error: error.message,
      }
    }
  })

  ipcMain.handle(IPC.RECORDING.STOP, async () => {
    try {
      if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop()
      }

      return {
        success: true,
        isRecording: false,
      }
    } catch (error) {
      console.error('Failed to stop recording:', error)
      return {
        success: false,
        error: error.message,
      }
    }
  })

  ipcMain.handle(IPC.RECORDING.STATUS, () => {
    return {
      isRecording,
      hasRecorder: !!mediaRecorder,
    }
  })

  ipcMain.handle(IPC.RECORDING.SAVE_PATH, async () => {
    try {
      const result = await dialog.showSaveDialog({
        defaultPath: `screen-recording-${Date.now()}.webm`,
        filters: [
          { name: 'WebM Video', extensions: ['webm'] },
          { name: 'All Files', extensions: ['*'] },
        ],
      })

      if (!result.canceled && result.filePath) {
        return {
          success: true,
          filePath: result.filePath,
        }
      }

      return {
        success: false,
        canceled: true,
      }
    } catch (error) {
      console.error('Failed to get save path:', error)
      return {
        success: false,
        error: error.message,
      }
    }
  })
}
