import { MediaStreamRecorder } from './mediaStreamRecorder';
import { Config } from '../base';

export class StreamRecorder extends MediaStreamRecorder {
  constructor(mediaStream: MediaStream, config: Config) {
    super(config, undefined, mediaStream);
  }
  public record(): void {
    super.record();
  }

}