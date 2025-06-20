import { useCallback, useEffect, useState, useRef } from 'react'

const { MiniVideoMe } = window

export function useScreenRecording() {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingStatus, setRecordingStatus] = useState<
    'idle' | 'preparing' | 'recording' | 'stopping'
  >('idle')
  const [error, setError] = useState<string | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recordedChunksRef = useRef<Blob[]>([])

  const startRecording = useCallback(async () => {
    try {
      setRecordingStatus('preparing')
      setError(null)

      // Get screen source from main process
      const result = await MiniVideoMe.startRecording()

      if (!result.success) {
        throw new Error(result.error || 'Failed to get screen source')
      }

      // Request screen capture with the source ID
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          mandatory: {
            chromeMediaSource: 'desktop',
          },
        } as any,
        video: {
          mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: result.sourceId,
            maxWidth: 1920,
            maxHeight: 1080,
            maxFrameRate: 30,
          },
        } as any,
      })

      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp8,opus',
      })

      recordedChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        setRecordingStatus('stopping')

        // Get save path from user
        const saveResult = await MiniVideoMe.getSavePath()

        if (saveResult.success && !saveResult.canceled) {
          // Create blob and download
          const blob = new Blob(recordedChunksRef.current, {
            type: 'video/webm',
          })
          const url = URL.createObjectURL(blob)

          // Create download link
          const a = document.createElement('a')
          a.href = url
          a.download = saveResult.filePath.split('/').pop() || 'recording.webm'
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)

          URL.revokeObjectURL(url)
        }

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop())
        setIsRecording(false)
        setRecordingStatus('idle')
      }

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event)
        setError('Recording failed')
        setIsRecording(false)
        setRecordingStatus('idle')
      }

      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start(1000) // Collect data every second

      setIsRecording(true)
      setRecordingStatus('recording')
    } catch (err) {
      console.error('Failed to start recording:', err)
      setError(err instanceof Error ? err.message : 'Failed to start recording')
      setRecordingStatus('idle')
    }
  }, [])

  const stopRecording = useCallback(() => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === 'recording'
    ) {
      mediaRecorderRef.current.stop()
    }
  }, [])

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }, [isRecording, startRecording, stopRecording])

  // Listen for global shortcut
  useEffect(() => {
    const handleToggle = () => {
      toggleRecording()
    }

    MiniVideoMe.onRecordingToggleRequested(handleToggle)

    return () => {
      MiniVideoMe.removeRecordingToggleListener(handleToggle)
    }
  }, [toggleRecording])

  return {
    isRecording,
    recordingStatus,
    error,
    startRecording,
    stopRecording,
    toggleRecording,
  }
}
