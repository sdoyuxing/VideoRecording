import { VedioRecorder } from './vedioRecorder';
import { CanvasRecorder } from './canvasRecorder';
import { AudioRecorder } from './audioRecorder';
import { MediaStreamRecorder } from './mediaStreamRecorder';
import { window, Config } from './base';

class VideoRecording {
  private recorder: MediaStreamRecorder
  private element: HTMLElement
  constructor(element: HTMLElement, config?: Config) {
    this.element = element;
    if (element instanceof HTMLCanvasElement) {
      this.recorder = new CanvasRecorder(element, config || { type: 'video' });
    }
    if (element instanceof HTMLVideoElement) {
      this.recorder = new VedioRecorder(element, config || { type: 'video' });
    }
    if (element instanceof HTMLAudioElement) {
      this.recorder = new AudioRecorder(element, config || { type: 'audio' });
    }
  }
  public startRecording(): void {
    this.recorder.record();
  }
  public stopRecording(): Promise<Blob> {
    return this.recorder.stop();

  }
  public getBlobs(): Blob {
    return this.recorder.getBlobs();
  }
}

window.VideoRecording = VideoRecording;

export default VideoRecording;
