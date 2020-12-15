# VideoRecording.js | [1.1.0](https://github.com/sdoyuxing/VideoRecording/blob/master/ReleaseNote.md)

**js库录制vedio、audio、canvas播放的内容**


[![npm](https://img.shields.io/npm/v/videorecording.svg)](https://npmjs.org/package/videorecording) [![downloads](https://img.shields.io/npm/dm/videorecording.svg)](https://npmjs.org/package/videorecording)

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


## 浏览器支持

| Browser        | Operating System                    | Features               |
| -------------  |-------------                        |---------------------   |
| Google Chrome  | Windows                             |  video |
| Firefox        | Windows                             |  video |
| Edge (new)     | Windows (7 or 8 or 10)              |  video |
<!-- | Opera          | Windows + macOS + Ubuntu + Android  |  video  |
| Safari         | macOS + iOS (iPhone/iPad)           |  video  | -->



## 通过标签方式直接引入

```html
<script src="VideoRecording.js"></script>
```


## npm引入

```javascript
npm install VideoRecording --save
```

```javascript
import VideoRecording from "VideoRecording"

var videoRecording = new VideoRecording(document.getElementById("video"))
```

## API

* VideoRecording构造函数传参要录制的vedio、audio、canvas的Dom对象。
* startRecording:开始录制。
* stopRecording:停止录制，返回Promies;then方法的参数是录制完成的Blob对象

## Issues提问

* Github: [https://github.com/sdoyuxing/VideoRecording/issues](https://github.com/sdoyuxing/VideoRecording/issues)






