# lrc-parser
This is an npm library for parsing NetEase Cloud Music's line-by-line lyrics (LRC) and word-by-word lyrics (YRC) for use with [XCMusic](https://github.com/yiktllw/XCMusic).

## Installation
```shell
npm install @yiktllw/lrc-parser
```

## Usage
 - `standardizeNcmLrc(str: string): string`: NetEase Cloud Music's LRC lyrics contain some JSON information. This function can be used to convert the JSON information into standard LRC information.
 - `parseLrc(str: string): ILrcItem[]`: Parse standard LRC lyrics into
 ```typescript
 interface ILrcItem {
  startTime: TimeSpan,
  text: string
 }
 ```
 - `parseNcmLrc(str: string): ILrcItem[]`: Equivalent to `parseLrc(standardizeNcmLrc(str))`
 - `parseNcmYrc(str: string): IYrcItem[]`: Parse NetEase Cloud Music's YRC lyrics into:
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
 
 In the above functions, `TimeSpan` is defined as:
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