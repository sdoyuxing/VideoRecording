import { MediaStreamRecorder } from './mediaStreamRecorder';
import { Config } from './base';

export class CanvasRecorder extends MediaStreamRecorder {
  constructor(canvasElement: HTMLCanvasElement, config: Config) {
    canvasElement.getContext('2d');
    super(new MediaStream(), canvasElement, config);
  }
  public record(): void {
    super.record();
  }

}