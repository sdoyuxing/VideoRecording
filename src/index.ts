import { VedioRecorder } from './vedioRecorder'
import { CanvasRecorder } from './canvasRecorder'
import { AudioRecorder } from './audioRecorder'
import { MediaStreamRecorder } from './mediaStreamRecorder'

declare var window: any;

class VideoRecording {
    private recorder: MediaStreamRecorder
    private element: HTMLElement
    constructor(element: HTMLElement) {
        this.element = element
        if (element instanceof HTMLCanvasElement) {
            this.recorder = new CanvasRecorder(element)
        }
        if (element instanceof HTMLVideoElement) {
            this.recorder = new VedioRecorder(element)
        }
        if (element instanceof HTMLAudioElement) {
            this.recorder = new AudioRecorder(element)
        }
    }
    public startRecording(): void {
        this.recorder.record()
    }
    public stopRecording(): Promise<Blob> {
        return this.recorder.stop()

    }
    public getBlobs(): Blob {
        return this.recorder.getBlobs()
    }
}

window.VideoRecording = VideoRecording;

export default VideoRecording
