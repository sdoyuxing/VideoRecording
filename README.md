# VideoRecording.js

**js库录制vedio播放的内容**


<!-- [![npm](https://img.shields.io/npm/v/recordrtc.svg)](https://npmjs.org/package/recordrtc) [![downloads](https://img.shields.io/npm/dm/recordrtc.svg)](https://npmjs.org/package/recordrtc) [![Build Status: Linux](https://travis-ci.org/muaz-khan/RecordRTC.png?branch=master)](https://travis-ci.org/muaz-khan/RecordRTC) -->

**代码演示:**

```javascript
var videoRecording = new VideoRecording(document.getElementById("video"))

document.getElementById("start").onclick = function () {
    videoRecording.startRecording();
}

document.getElementById("stop").onclick = function () {
    videoRecording.stopRecording().then((blob) => {
        document.getElementById('preview').src = window.URL.createObjectURL(blob);
    });
}
```


<!-- ## Browsers Support

| Browser        | Operating System                    | Features               |
| -------------  |-------------                        |---------------------   |
| Google Chrome  | Windows + macOS + Ubuntu + Android  |  video |
| Firefox        | Windows + macOS + Ubuntu + Android  |  video |
| Opera          | Windows + macOS + Ubuntu + Android  |  video  |
| Edge (new)     | Windows (7 or 8 or 10) and MacOSX   | video  |
| Safari         | macOS + iOS (iPhone/iPad)           |  video  | -->



## 通过标签方式直接引入

```html
<script src="VideoRecording.js"></script>
```


## npm引入

MediaStream parameter accepts following values:

```javascript
import VideoRecording from "VideoRecording"

var videoRecording = new VideoRecording(document.getElementById("video"))
```

## API

* VideoRecording构造函数传参要录制的vedio Dom。
* startRecording:开始录制。
* stopRecording:停止录制，返回Promies;then方法的参数是录制完成的Blob对象

## Issues提问

* Github: [https://github.com/sdoyuxing/VideoRecording/issues](https://github.com/sdoyuxing/VideoRecording/issues)






