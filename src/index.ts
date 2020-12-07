import { Transition } from './transition'
import { Record } from './record'
import '@babel/polyfill'

declare var window: any;

class VideoRecording {
    private vedioElement: HTMLVideoElement
    private recorder: Record
    private canvasElement: HTMLCanvasElement
    private transition: Transition
    constructor(vedioElement: HTMLVideoElement, canvasElement?: HTMLCanvasElement) {
        this.vedioElement = vedioElement
        this.transition = new Transition(this.render.bind(this))
        this.canvasElement = canvasElement || document.createElement("canvas");
        this.recorder = new Record(this.canvasElement, 'canvas');
        if (this.vedioElement.videoWidth === 0) {
            this.vedioElement.onloadeddata = () => {
                this.canvasElement.width = this.vedioElement.videoWidth;
                this.canvasElement.height = this.vedioElement.videoHeight;
            }
        } else {
            this.canvasElement.width = this.vedioElement.videoWidth;
            this.canvasElement.height = this.vedioElement.videoHeight;
        }
    }
    public startRecording(): void {
        this.recorder.startRecording()
        this.render()
        this.transition.start()
    }
    private render(): void {
        this.canvasElement.getContext("2d").drawImage(this.vedioElement, 0, 0, this.canvasElement.width, this.canvasElement.height)
    }
    public stopRecording(): Promise<Blob> {
        this.transition.stop()
        return this.recorder.stopRecording()

    }
    public getBlobs() {
        return this.recorder.getBlobs()
    }
}

window.VideoRecording = VideoRecording;

export default VideoRecording
