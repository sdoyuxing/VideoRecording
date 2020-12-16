import { MediaStreamRecorder } from './mediaStreamRecorder';
import { Config } from './base';

export class AudioRecorder extends MediaStreamRecorder {
  constructor(audioElement: HTMLAudioElement, config: Config) {
    if (config.type === 'video') {
      throw 'Audio recording configuration item type cannot be video.';
      return;
    }
    super(audioElement, config);
  }
  public record(): void {
    super.record();
  }

}