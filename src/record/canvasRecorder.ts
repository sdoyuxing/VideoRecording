import { MediaStreamRecorder } from "./mediaStreamRecorder"
export class CanvasRecorder extends MediaStreamRecorder {
    constructor(canvasElement) {
        super(new MediaStream())
        this.canvasElement = canvasElement;
    }
    private canvasElement: any
    public record(): void {
        let canvasMediaStream
        if ('captureStream' in this.canvasElement) {
            canvasMediaStream = this.canvasElement.captureStream(25); // 25 FPS
        } else if ('mozCaptureStream' in this.canvasElement) {
            canvasMediaStream = this.canvasElement.mozCaptureStream(25);
        } else if ('webkitCaptureStream' in this.canvasElement) {
            canvasMediaStream = this.canvasElement.webkitCaptureStream(25);
        }
        this.mdStream.addTrack(this.getTracks(canvasMediaStream, 'video')[0]);
        super.record()
    }
    private getTracks(stream: MediaStream, kind: string = "audio") {
        if (!stream || !stream.getTracks) {
            return [];
        }
        return stream.getTracks().filter(function (t) {
            return t.kind === kind;
        });
    }
}