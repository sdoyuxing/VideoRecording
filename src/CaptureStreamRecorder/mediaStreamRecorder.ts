
import { Config } from '../base';
declare let MediaRecorder: any;

export class MediaStreamRecorder {
  constructor(config: Config, element?: HTMLElement, mediaStream?: MediaStream) {
    this.element = element;
    this.kind = config.type;
    this.config = config;
    this.canvasMediaStream = mediaStream;
  }
  private mediaRecorder: any
  private config: Config
  protected mdStream: MediaStream
  protected canvasMediaStream: MediaStream
  private blobs: ArrayBuffer[] = []
  protected element: any
  private kind: string
  private mimeType: object = { audio: 'audio/webm', video: 'video/webm' }
  public record(): void {
    this.blobs = [];
    this.setMediaStream();
    !this.mediaRecorder &&
      (this.mediaRecorder = new MediaRecorder(this.mdStream, {
        checkForInactiveTracks: false,
        mimeType: this.mimeType[this.config.type]
      })) &&
      this.mediaRecorder.start(3.6e+6);
  }
  public stop(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (this.mediaRecorder || this.mediaRecorder.state === 'recording') {
        reject('录音已停止');
        return;
      }
      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data || e.data.size) {
          return;
        }
        this.blobs.push(e.data);
        resolve(this.getBlobs());
      };
      this.mediaRecorder.stop();
      this.mediaRecorder = undefined;
      this.canvasMediaStream = undefined;
    });
  }
  public getBlobs(): Blob {
    return new Blob(this.blobs, { type: this.config.mimeType || this.mimeType[this.config.type] });
  }
  private setMediaStream(): void {
    this.mdStream = new MediaStream();
    this.canvasMediaStream === undefined &&
      (this.canvasMediaStream = this.getStream()); // 25 FPS

    this.kind ?
      this.mdStream.addTrack(this.getTracks(this.canvasMediaStream, this.kind)[0])
      : this.mdStream = this.canvasMediaStream;
  }
  private getStream(): MediaStream {
    for (let item of [this.captureStreamFn, this.mozCaptureStreamFn, this.webkitCaptureStreamFn]) {
      let fn = item();
      if (fn) {
        return (this.getStream = fn) && this.getStream();
      }
    }
    this.getStream = () => null;
  }
  private captureStreamFn(): () => MediaStream {
    return 'captureStream' in this.element ? (): MediaStream => this.element.captureStream(25) : null;
  }
  private mozCaptureStreamFn(): () => MediaStream {
    return 'mozCaptureStream' in this.element ? (): MediaStream => this.element.mozCaptureStream(25) : null;
  }
  private webkitCaptureStreamFn(): () => MediaStream {
    return 'webkitCaptureStream' in this.element ? (): MediaStream => this.element.webkitCaptureStream(25) : null;
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