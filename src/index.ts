import { Transition } from './transition'
import { Record } from './record'

declare var window: any;

class VideoRecording {
    private vedioElement: HTMLVideoElement
    private recorder: Record
    private canvasElement: HTMLCanvasElement
    private transition: Transition
    private context2d: CanvasRenderingContext2D
    constructor(vedioElement: HTMLVideoElement, canvasElement?: HTMLCanvasElement) {
        this.vedioElement = vedioElement
        this.transition = new Transition(this.render.bind(this))
        this.canvasElement = canvasElement || document.createElement("canvas");
        this.recorder = new Record(this.canvasElement, 'canvas');
        this.context2d = this.canvasElement.getContext("2d");
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
        this.context2d.drawImage(this.vedioElement, 0, 0, this.canvasElement.width, this.canvasElement.height)
    }
    public stopRecording(): Promise<Blob> {
        this.transition.stop()
        return this.recorder.stopRecording()

    }
    public getBlobs(): Blob {
        return this.recorder.getBlobs()
    }
}

window.VideoRecording = VideoRecording;

export default VideoRecording
