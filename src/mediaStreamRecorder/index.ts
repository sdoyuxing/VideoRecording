
import { MediaRecorder, Config } from '../base';
export class MediaStreamRecorder {
  constructor(mdStream: MediaStream, element: HTMLElement, config: Config) {
    this.mdStream = mdStream;
    this.element = element;
    this.kind = config.type;
    this.config = config;
  }
  private mediaRecorder: any
  private config: Config
  protected mdStream: MediaStream
  private blobs: ArrayBuffer[] = []
  protected element: any
  private kind: string
  private mimeType: object = { audio: 'audio/wav', video: 'video/webm' }
  public record(): void {
    this.blobs = [];
    this.setMediaStream();
    this.mediaRecorder = new MediaRecorder(this.mdStream, {
      checkForInactiveTracks: false,
      mimeType: this.mimeType[this.config.type]
    });

    this.mediaRecorder.start(3.6e+6);
  }
  public stop(): Promise<Blob> {
    return new Promise((resolve) => {
      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size) {
          this.blobs.push(e.data);
          resolve(this.getBlobs());
        }
      };
      this.mediaRecorder.stop();
    });
  }
  public getBlobs(): Blob {
    return new Blob(this.blobs, { type: this.mimeType[this.config.type] });
  }
  private setMediaStream(): void {
    let canvasMediaStream;
    if ('captureStream' in this.element) {
      canvasMediaStream = this.element.captureStream(25); // 25 FPS
    } else if ('mozCaptureStream' in this.element) {
      canvasMediaStream = this.element.mozCaptureStream(25);
    } else if ('webkitCaptureStream' in this.element) {
      canvasMediaStream = this.element.webkitCaptureStream(25);
    }
    if (this.kind)
      this.mdStream.addTrack(this.getTracks(canvasMediaStream, this.kind)[0]);
    else this.mdStream = canvasMediaStream;
  }
  private getTracks(stream: MediaStream, kind: string = 'audio'): MediaStreamTrack[] {
    if (!stream || !stream.getTracks) {
      return [];
    }
    return stream.getTracks().filter(function (t) {
      return t.kind === kind;
    });
  }
}