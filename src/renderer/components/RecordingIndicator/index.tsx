import React from 'react'
import { useScreenRecording } from 'renderer/hooks'

export function RecordingIndicator() {
  const { isRecording, recordingStatus, error } = useScreenRecording()

  if (recordingStatus === 'idle') {
    return null
  }

  return (
    <div className="recording-indicator">
      <div className="recording-status">
        {recordingStatus === 'preparing' && (
          <div className="status-preparing">
            <div className="pulse-dot"></div>
            <span>Preparing...</span>
          </div>
        )}
        
        {recordingStatus === 'recording' && (
          <div className="status-recording">
            <div className="recording-dot"></div>
            <span>Recording</span>
          </div>
        )}
        
        {recordingStatus === 'stopping' && (
          <div className="status-stopping">
            <div className="pulse-dot"></div>
            <span>Saving...</span>
          </div>
        )}
        
        {error && (
          <div className="status-error">
            <span>Error: {error}</span>
          </div>
        )}
      </div>
    </div>
  )
} 