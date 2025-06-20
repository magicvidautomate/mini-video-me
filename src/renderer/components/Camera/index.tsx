import { useCamera } from 'renderer/hooks'
import { Status } from '../Status'
import { RecordingIndicator } from '../RecordingIndicator'

export function Camera() {
  const { status, isCameraFound, videoElementRef, wrapperElementRef } =
    useCamera()

  if (!isCameraFound) {
    return <Status status={status} />
  }

  return (
    <div ref={wrapperElementRef} id="wrapper">
      <div className="video-wrapper">
        <video ref={videoElementRef} id="video" autoPlay muted></video>
        <RecordingIndicator />
      </div>
    </div>
  )
}
