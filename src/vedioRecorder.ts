import { MediaStreamRecorder } from './mediaStreamRecorder';
import { Config } from './base';

export class VedioRecorder extends MediaStreamRecorder {
  constructor(videoElement: HTMLVideoElement, config: Config) {
    super(videoElement, config);
  }
  public record(): void {
    super.record();
  }

}