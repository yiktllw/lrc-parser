# lrc-parser
[English Version](README-EN.md)

这是供[XCMusic](https://github.com/yiktllw/XCMusic)使用的，解析网易云音乐逐行歌词（LRC）和逐字歌词（YRC）的npm库。

## 安装
```shell
npm install @yiktllw/lrc-parser
```

## 用法
 - `standardizeNcmLrc(str: string): string`: 网易云音乐的LRC歌词含有部分JSON信息，可以使用此函数将JSON信息转化为标准LRC信息。
 - `parseLrc(str: string): ILrcItem[]`: 将标准LRC歌词解析为
 ```typescript
 interface ILrcItem {
  startTime: TimeSpan,
  text: string
 }
 ```
 - `parseNcmLrc(str: string): ILrcItem[]`： 相当于`parseLrc(standardizeNcmLrc(str))`
 - `parseNcmYrc(str: string): IYrcItem[]`: 将网易云音乐的YRC歌词解析成：
 ```typescript
interface IYrcItem {
  startTime: TimeSpan;
  duration: TimeSpan;
  words: Array<{
    startTime: TimeSpan;
    duration: TimeSpan;
    text: string;
  }>;
}
 ```
 
 在上述函数中，`TimeSpan`定义为：
```typescript
class TimeSpan {
    private time;
    constructor(num: number, unit: "ms" | "s" | "m" | "h");
    constructor(h: number, m: number, s: number, ms: number);
    get ms(): number;
    get seconds(): number;
    get minutes(): number;
    get hours(): number;
    get mmss(): string;
}
``` 