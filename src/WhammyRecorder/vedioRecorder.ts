import { Whammy } from './whammy';
import { Config, Frame } from '../base';
import { Transition } from '../transition';

export class VedioRecorder {
  constructor(videoElement: HTMLVideoElement) {
    // super(config, videoElement);
    this.video = videoElement;
    this.canvas = document.createElement('canvas');
    let lastTime: number = 0;
    this.transition = new Transition(() => {
      this.canvas.getContext('2d').drawImage(this.video, 0, 0, this.video.videoWidth, this.video.videoHeight);
      this.frames.push({
        duration: new Date().getTime() - lastTime,
        image: this.parseWebP(this.parseRIFF(atob(this.canvas.toDataURL('image/webp').slice(23))))
      });
      lastTime = new Date().getTime();
    });
  }
  private video: HTMLVideoElement
  private transition: Transition
  private frames: Frame[] = []
  private canvas: HTMLCanvasElement
  public record(): void {
    this.transition.start();
  }
  public stop(): void {
    this.ArrayToWebM(this.frames);
  }
  private parseRIFF(string: string) {
    let offset = 0;
    let chunks = {};

    while (offset < string.length) {
      let id = string.substr(offset, 4);
      let len = this.getStrLength(string, offset);
      let data = string.substr(offset + 4 + 4, len);
      offset += 4 + 4 + len;
      chunks[id] = chunks[id] || [];
      if (id === 'RIFF' || id === 'LIST') {
        chunks[id].push(this.parseRIFF(data));
      } else {
        chunks[id].push(data);
      }
    }
    return chunks;
  }

  private getStrLength(string: string, offset: number): number {
    return parseInt(string.substr(offset + 4, 4).split('').map(function (i) {
      let unpadded = i.charCodeAt(0).toString(2);
      console.log(new Array(8 - unpadded.length + 1));
      return (new Array(8 - unpadded.length + 1)).join('0') + unpadded;
    }).join(''), 2);
  }

  private parseWebP(riff) {
    let VP8 = riff.RIFF[0].WEBP[0];
    let c = [];
    let frameStart = VP8.indexOf('\x9d\x01\x2a'); // A VP8 keyframe starts with the 0x9d012a header
    for (let i = 0; i < 4; i++) {
      c[i] = VP8.charCodeAt(frameStart + 3 + i);
    }

    let width, height, tmp;

    //the code below is literally copied verbatim from the bitstream spec
    tmp = (c[1] << 8) | c[0];
    width = tmp & 0x3FFF;
    tmp = (c[3] << 8) | c[2];
    height = tmp & 0x3FFF;
    return {
      width: width,
      height: height,
      data: VP8,
      riff: riff
    };
  }

  private checkFrames(frames) {
    if (!frames[0]) {
      return;
    }

    let width = frames[0].width,
      height = frames[0].height,
      duration = frames[0].duration;

    for (let i = 1; i < frames.length; i++) {
      duration += frames[i].duration;
    }
    return {
      duration: duration,
      width: width,
      height: height
    };
  }


  private getClusterData(clusterTimecode, clusterCounter, clusterFrames) {
    return [{
      'data': clusterTimecode,
      'id': 0xe7 // Timecode
    }].concat(clusterFrames.map(function (webp) {
      let block = this.makeSimpleBlock({
        discardable: 0,
        frame: webp.data.slice(4),
        invisible: 0,
        keyframe: 1,
        lacing: 0,
        trackNum: 1,
        timecode: Math.round(clusterCounter)
      });
      clusterCounter += webp.duration;
      return {
        data: block,
        id: 0xa3
      };
    }));
  }


  private makeSimpleBlock(data) {
    let flags = 0;

    if (data.keyframe) {
      flags |= 128;
    }

    if (data.invisible) {
      flags |= 8;
    }

    if (data.lacing) {
      flags |= (data.lacing << 1);
    }

    if (data.discardable) {
      flags |= 1;
    }

    if (data.trackNum > 127) {
      throw 'TrackNumber > 127 not supported';
    }

    let out = [data.trackNum | 0x80, data.timecode >> 8, data.timecode & 0xff, flags].map(function (e) {
      return String.fromCharCode(e);
    }).join('') + data.frame;

    return out;
  }

  private doubleToString(num) {
    return [].slice.call(
      new Uint8Array((new Float64Array([num])).buffer), 0).map(function (e) {
      return String.fromCharCode(e);
    }).reverse().join('');
  }

  private generateEBML(json) {
    let ebml = [];
    for (let i = 0; i < json.length; i++) {
      let data = json[i].data;

      if (typeof data === 'object') {
        data = this.generateEBML(data);
      }

      if (typeof data === 'number') {
        data = this.bitsToBuffer(data.toString(2));
      }

      if (typeof data === 'string') {
        data = this.strToBuffer(data);
      }

      let len = data.size || data.byteLength || data.length;
      let zeroes = Math.ceil(Math.ceil(Math.log(len) / Math.log(2)) / 8);
      let sizeToString = len.toString(2);
      let padded = (new Array((zeroes * 7 + 7 + 1) - sizeToString.length)).join('0') + sizeToString;
      let size = (new Array(zeroes)).join('0') + '1' + padded;

      ebml.push(numToBuffer(json[i].id));
      ebml.push(bitsToBuffer(size));
      ebml.push(data);
    }

    return new Blob(ebml, {
      type: 'video/webm'
    });
  }
  private ArrayToWebM(frames) {
    let info = this.checkFrames(frames);
    if (!info) {
      return [];
    }

    let clusterMaxDuration = 30000;

    let EBML = [{
      'id': 0x1a45dfa3, // EBML
      'data': [{
        'data': 1,
        'id': 0x4286 // EBMLVersion
      }, {
        'data': 1,
        'id': 0x42f7 // EBMLReadVersion
      }, {
        'data': 4,
        'id': 0x42f2 // EBMLMaxIDLength
      }, {
        'data': 8,
        'id': 0x42f3 // EBMLMaxSizeLength
      }, {
        'data': 'webm',
        'id': 0x4282 // DocType
      }, {
        'data': 2,
        'id': 0x4287 // DocTypeVersion
      }, {
        'data': 2,
        'id': 0x4285 // DocTypeReadVersion
      }]
    }, {
      'id': 0x18538067, // Segment
      'data': [{
        'id': 0x1549a966, // Info
        'data': [{
          'data': 1e6, //do things in millisecs (num of nanosecs for duration scale)
          'id': 0x2ad7b1 // TimecodeScale
        }, {
          'data': 'whammy',
          'id': 0x4d80 // MuxingApp
        }, {
          'data': 'whammy',
          'id': 0x5741 // WritingApp
        }, {
          'data': this.doubleToString(info.duration),
          'id': 0x4489 // Duration
        }]
      }, {
        'id': 0x1654ae6b, // Tracks
        'data': [{
          'id': 0xae, // TrackEntry
          'data': [{
            'data': 1,
            'id': 0xd7 // TrackNumber
          }, {
            'data': 1,
            'id': 0x73c5 // TrackUID
          }, {
            'data': 0,
            'id': 0x9c // FlagLacing
          }, {
            'data': 'und',
            'id': 0x22b59c // Language
          }, {
            'data': 'V_VP8',
            'id': 0x86 // CodecID
          }, {
            'data': 'VP8',
            'id': 0x258688 // CodecName
          }, {
            'data': 1,
            'id': 0x83 // TrackType
          }, {
            'id': 0xe0, // Video
            'data': [{
              'data': info.width,
              'id': 0xb0 // PixelWidth
            }, {
              'data': info.height,
              'id': 0xba // PixelHeight
            }]
          }]
        }]
      }]
    }];

    //Generate clusters (max duration)
    let frameNumber = 0;
    let clusterTimecode = 0;
    while (frameNumber < frames.length) {

      let clusterFrames = [];
      let clusterDuration = 0;
      do {
        clusterFrames.push(frames[frameNumber]);
        clusterDuration += frames[frameNumber].duration;
        frameNumber++;
      } while (frameNumber < frames.length && clusterDuration < clusterMaxDuration);

      let clusterCounter = 0;
      let cluster = {
        'id': 0x1f43b675, // Cluster
        'data': this.getClusterData(clusterTimecode, clusterCounter, clusterFrames)
      }; //Add cluster to segment
      EBML[1].data.push(cluster);
      clusterTimecode += clusterDuration;
    }

    return this.generateEBML(EBML);
  }
}