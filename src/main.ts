import { VedioRecorder } from './WhammyRecorder/vedioRecorder';
declare let window: any;

class VideoRecording {
  private recorder: VedioRecorder
  constructor(source: HTMLVideoElement) {
    this.recorder = new VedioRecorder(source);
  }
  public startRecording(): void {
    this.recorder.record();
  }
}
window.VideoRecording = VideoRecording;

export default VideoRecording;