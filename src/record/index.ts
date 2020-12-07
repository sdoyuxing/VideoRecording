import { CanvasRecorder } from './canvasRecorder'
import { MediaStreamRecorder } from "./mediaStreamRecorder"
export class Record {
    constructor(mediaStream: any, type: string = "canvas") {
        if (type === "canvas") {
            this.recordObject = new CanvasRecorder(mediaStream)
        }
    }
    private recordObject: MediaStreamRecorder
    public startRecording(): void {
        this.recordObject.record();
    }
    public stopRecording(): Promise<Blob> {
        return this.recordObject.stop();
    }
    public getBlobs(): Blob {
        return this.recordObject.getBlobs()
    }
}