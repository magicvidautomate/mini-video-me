import React, { useState } from 'react'
import { useCamera, useScreenRecording } from 'renderer/hooks'
import { config } from 'renderer/store'

const { MiniVideoMe } = window
const { shortcuts } = config

export function ControlPanel() {
  const [isVisible, setIsVisible] = useState(true)
  const [isExpanded, setIsExpanded] = useState(true)
  const { toggleShapes } = useCamera()
  const { isRecording, toggleRecording, recordingStatus } = useScreenRecording()

  const toggleVisibility = () => {
    setIsVisible(!isVisible)
    if (!isVisible) {
      setIsExpanded(false)
    }
  }

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  const handleZoomIn = () => {
    // Simulate keypress for zoom in
    const event = new KeyboardEvent('keydown', { key: '=' })
    document.dispatchEvent(event)
  }

  const handleZoomOut = () => {
    // Simulate keypress for zoom out
    const event = new KeyboardEvent('keydown', { key: '-' })
    document.dispatchEvent(event)
  }

  const handleFlipHorizontal = () => {
    const event = new KeyboardEvent('keydown', { key: '/' })
    document.dispatchEvent(event)
  }

  const handleToggleShapes = () => {
    const event = new KeyboardEvent('keydown', { key: 'o' })
    document.dispatchEvent(event)
  }

  const handleReset = () => {
    const event = new KeyboardEvent('keydown', { key: 'r' })
    document.dispatchEvent(event)
  }

  const handleToggleCam = () => {
    const event = new KeyboardEvent('keydown', { key: 'Backspace' })
    document.dispatchEvent(event)
  }

  const handleToggleWindowSize = () => {
    const event = new KeyboardEvent('keydown', { key: ' ' })
    document.dispatchEvent(event)
  }

  const handleOpenSettings = () => {
    MiniVideoMe.openPreferencesFile()
  }

  if (!isVisible) {
    return (
      <div className="control-panel-toggle" onClick={toggleVisibility}>
        <div className="toggle-icon">⚙️</div>
      </div>
    )
  }

  return (
    <div className={`control-panel ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="control-panel-header" onClick={toggleExpanded}>
        <span className="header-title">Controls</span>
        <div className="header-actions">
          <button className="expand-btn" onClick={(e) => { e.stopPropagation(); toggleExpanded(); }}>
            {isExpanded ? '▼' : '▶'}
          </button>
          <button className="close-btn" onClick={(e) => { e.stopPropagation(); toggleVisibility(); }}>
            ✕
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="control-panel-content">
          <div className="control-section">
            <h4>Camera Controls</h4>
            <div className="control-grid">
              <button className="control-btn" onClick={handleZoomIn} title={`Zoom In (${shortcuts.zoom.in})`}>
                <span className="btn-icon">🔍+</span>
                <span className="btn-label">Zoom In</span>
                <span className="btn-shortcut">{shortcuts.zoom.in}</span>
              </button>
              
              <button className="control-btn" onClick={handleZoomOut} title={`Zoom Out (${shortcuts.zoom.out})`}>
                <span className="btn-icon">🔍-</span>
                <span className="btn-label">Zoom Out</span>
                <span className="btn-shortcut">{shortcuts.zoom.out}</span>
              </button>
              
              <button className="control-btn" onClick={handleFlipHorizontal} title={`Flip Horizontal (${shortcuts.flipHorizontal})`}>
                <span className="btn-icon">🔄</span>
                <span className="btn-label">Flip</span>
                <span className="btn-shortcut">{shortcuts.flipHorizontal}</span>
              </button>
              
              <button className="control-btn" onClick={handleReset} title={`Reset Zoom (${shortcuts.reset})`}>
                <span className="btn-icon">↺</span>
                <span className="btn-label">Reset</span>
                <span className="btn-shortcut">{shortcuts.reset}</span>
              </button>
              
              <button className="control-btn" onClick={handleToggleCam} title={`Switch Camera (${shortcuts.toggleCam})`}>
                <span className="btn-icon">📹</span>
                <span className="btn-label">Switch Cam</span>
                <span className="btn-shortcut">{shortcuts.toggleCam}</span>
              </button>
              
              <button className="control-btn" onClick={handleToggleWindowSize} title={`Toggle Size (${shortcuts.toggleWindowSize})`}>
                <span className="btn-icon">📐</span>
                <span className="btn-label">Toggle Size</span>
                <span className="btn-shortcut">{shortcuts.toggleWindowSize}</span>
              </button>
            </div>
          </div>

          <div className="control-section">
            <h4>Appearance</h4>
            <div className="control-grid">
              <button className="control-btn" onClick={handleToggleShapes} title={`Toggle Shapes (${shortcuts.toggleShapes})`}>
                <span className="btn-icon">⭕</span>
                <span className="btn-label">Shapes</span>
                <span className="btn-shortcut">{shortcuts.toggleShapes}</span>
              </button>
            </div>
          </div>

          <div className="control-section">
            <h4>Recording</h4>
            <div className="control-grid">
              <button 
                className={`control-btn ${isRecording ? 'recording' : ''}`} 
                onClick={toggleRecording}
                disabled={recordingStatus === 'preparing' || recordingStatus === 'stopping'}
                title="Toggle Screen Recording (Shift+Alt+Cmd+R)"
              >
                <span className="btn-icon">{isRecording ? '⏹️' : '🔴'}</span>
                <span className="btn-label">
                  {recordingStatus === 'preparing' ? 'Preparing...' :
                   recordingStatus === 'stopping' ? 'Saving...' :
                   isRecording ? 'Stop Recording' : 'Start Recording'}
                </span>
                <span className="btn-shortcut">⇧⌥⌘R</span>
              </button>
            </div>
          </div>

          <div className="control-section">
            <h4>Settings</h4>
            <div className="control-grid">
              <button className="control-btn" onClick={handleOpenSettings} title={`Open Settings (${shortcuts.openPreferencesFile})`}>
                <span className="btn-icon">⚙️</span>
                <span className="btn-label">Settings</span>
                <span className="btn-shortcut">{shortcuts.openPreferencesFile}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 