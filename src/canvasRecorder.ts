import { MediaStreamRecorder } from './mediaStreamRecorder';
import { Config } from './base';

export class CanvasRecorder extends MediaStreamRecorder {
  constructor(canvasElement: HTMLCanvasElement, config: Config) {
    canvasElement.getContext('2d');
    if (config.type === 'audio') {
      throw 'Canvas recording configuration item type cannot be audio.';
      return;
    }
    super(canvasElement, config || { type: 'video' });
  }
  public record(): void {
    super.record();
  }

}