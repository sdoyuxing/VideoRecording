import { MediaStreamRecorder } from './mediaStreamRecorder';
import { Config } from './base';

export class AudioRecorder extends MediaStreamRecorder {
  constructor(audioElement: HTMLAudioElement, config: Config) {
    super(new MediaStream(), audioElement, config);
  }
  public record(): void {
    super.record();
  }

}