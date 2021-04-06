import { VedioRecorder } from './CaptureStreamRecorder/vedioRecorder';
import { CanvasRecorder } from './CaptureStreamRecorder/canvasRecorder';
import { AudioRecorder } from './CaptureStreamRecorder/audioRecorder';
import { MediaStreamRecorder } from './CaptureStreamRecorder/mediaStreamRecorder';
import { StreamRecorder } from './CaptureStreamRecorder/streamRecorder';
import { Config } from './base';

declare let window: any;

class VideoRecording {
  private recorder: MediaStreamRecorder
  constructor(source: HTMLCanvasElement | HTMLVideoElement | HTMLAudioElement | MediaStream, config?: Config) {
    if (source instanceof HTMLCanvasElement) {
      this.recorder = new CanvasRecorder(source, config || { type: 'video' });
    }
    if (source instanceof HTMLVideoElement) {
      this.recorder = new VedioRecorder(source, config || { type: '' });
    }
    if (source instanceof HTMLAudioElement) {
      this.recorder = new AudioRecorder(source, config || { type: 'audio' });
    }
    if (source instanceof MediaStream) {
      this.recorder = new StreamRecorder(source, config || { type: 'video' });
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
