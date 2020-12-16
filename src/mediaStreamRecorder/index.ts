
import { Config } from '../base';
declare let MediaRecorder: any;

export class MediaStreamRecorder {
  constructor(element: HTMLElement, config: Config) {
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
  private mimeType: object = { audio: 'audio/webm', video: 'video/webm' }
  public record(): void {
    this.blobs = [];
    this.setMediaStream();
    if (!this.mediaRecorder) {
      this.mediaRecorder = new MediaRecorder(this.mdStream, {
        checkForInactiveTracks: false,
        mimeType: this.mimeType[this.config.type]
      });

      this.mediaRecorder.start(3.6e+6);
    }
  }
  public stop(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
        this.mediaRecorder.ondataavailable = (e) => {
          if (e.data && e.data.size) {
            this.blobs.push(e.data);
            resolve(this.getBlobs());
          }
        };
        this.mediaRecorder.stop();
        this.mediaRecorder = undefined;
      } else {
        reject('录音已停止');
      }
    });
  }
  public getBlobs(): Blob {
    return new Blob(this.blobs, { type: this.mimeType[this.config.type] });
  }
  private setMediaStream(): void {
    this.mdStream = new MediaStream();
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