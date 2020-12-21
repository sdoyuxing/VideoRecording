import { MediaStreamRecorder } from './mediaStreamRecorder';
import { Config } from './base';

export class VedioRecorder extends MediaStreamRecorder {
  constructor(videoElement: HTMLVideoElement, config: Config) {
    super(config, videoElement);
  }
  public record(): void {
    super.record();
  }

}