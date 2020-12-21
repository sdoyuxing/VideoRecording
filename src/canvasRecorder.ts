import { MediaStreamRecorder } from './mediaStreamRecorder';
import { Config } from './base';

export class CanvasRecorder extends MediaStreamRecorder {
  constructor(canvasElement: HTMLCanvasElement, config: Config) {
    canvasElement.getContext('2d');
    if (config.type === 'audio') {
      throw 'Canvas recording configuration item type cannot be audio.';
      return;
    }
    super(config || { type: 'video' }, canvasElement);
  }
  public record(): void {
    super.record();
  }

}