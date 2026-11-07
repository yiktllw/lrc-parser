export function standardizeNcmLrc(ncm_lrc_str: string): string {
  return ncm_lrc_str
    .split("\n")
    .map((line) => {
      try {
        const { t, c } = JSON.parse(line);
        const content = c.map((item: { tx: string }) => item.tx).join("");
        return `${msToLrcTime(t)}${content}`;
      } catch {
        return line;
      }
    })
    .join("\n");
}

export function parseLrc(str: string): Array<ILrcItem> {
  return str
    .split("\n")
    .map((line) => {
      const match = /\[(\d+):(\d+)\.(\d+)\](.+)/.exec(line);
      return match
        ? {
            startTime: new TimeSpan(
              0,
              +match[1],
              +match[2],
              +`0.${match[3]}` * 1000,
            ),
            text: match[4],
          }
        : null;
    })
    .filter(Boolean) as ILrcItem[];
}

export const parseNcmLrc = (str: string): Array<ILrcItem> =>
  parseLrc(standardizeNcmLrc(str));

/** 逐字歌词的行标记：`[起始毫秒,时长毫秒](词起始,词时长,0)词` */
const YRC_LINE = /\[\d+,\d+\]/;

/**
 * 把网易云音乐的 YRC 歌词解析成逐字歌词
 *
 * 整段里没有任何真正的逐字行时返回空数组：整行歌词（LRC）正文前面也会带
 * 一行纯 JSON 的作词/作曲信息，那行能被当成本条逐字歌词，从而让调用方
 * 误以为这是 YRC，永远走不到整行歌词的解析分支。
 */
export function parseNcmYrc(str: string): Array<IYrcItem> {
  if (!YRC_LINE.test(str)) return [];
  return str
    .split("\n")
    .map((line) => {
      try {
        let obj = JSON.parse(line);
        return `[${obj.t},0](${obj.t},0,0)${obj.c.map((item: { tx: string }) => item.tx).join("")}`;
      } catch (e) {
        return line;
      }
    })
    .map((line) => {
      const linematch = /\[(\d+),(\d+)\](.+)/.exec(line);
      if (!linematch) return null;
      return {
        startTime: new TimeSpan(+linematch[1], "ms"),
        duration: new TimeSpan(+linematch[2], "ms"),
        words: Array.from(
          linematch[3].matchAll(/\((\d+),(\d+),(\d+)\)([^\(\)]+)/g),
          (element) => {
            return {
              startTime: new TimeSpan(+element[1], "ms"),
              duration: new TimeSpan(+element[2], "ms"),
              text: element[4],
            };
          },
        ),
      };
    })
    .filter(Boolean) as IYrcItem[];
}

export class TimeSpan {
  private time: number = 0;
  constructor(num: number, unit: "ms" | "s" | "m" | "h");
  constructor(h: number, m: number, s: number, ms: number);
  constructor(
    a: number,
    b: "ms" | "s" | "m" | "h" | number,
    c?: number,
    d?: number,
  ) {
    switch (b) {
      case "ms":
        this.time = a;
        break;
      case "s":
        this.time = a * 1000;
        break;
      case "m":
        this.time = a * 1000 * 60;
        break;
      case "h":
        this.time = a * 1000 * 60 * 60;
        break;
      default:
        this.time = a * 1000 * 60 * 60 + b * 1000 * 60 + c! * 1000 + d!;
        break;
    }
  }
  get ms() {
    return this.time;
  }
  get seconds() {
    return this.time / 1000;
  }
  get minutes() {
    return this.time / 1000 / 60;
  }
  get hours() {
    return this.time / 1000 / 60 / 60;
  }
  get mmss() {
    const minutes = Math.floor(this.minutes);
    const seconds = (this.seconds % 60).toFixed(3);
    return `${minutes >= 10 ? minutes : `0${minutes}`}:${+seconds >= 10 ? seconds : `0${seconds}`}`;
  }
}

function msToLrcTime(t: number): string {
  if (t < 0) t = 0;
  const _seconds = Math.floor(t / 1000);
  const _10_ms = Math.round((t - _seconds * 1000) / 10);
  const minutes = Math.floor(_seconds / 60);
  const seconds = _seconds - minutes * 60;
  return `[${minutes >= 10 ? minutes : `0${minutes}`}:${seconds >= 10 ? seconds : `0${seconds}`}.${_10_ms >= 10 ? _10_ms : `0${_10_ms}`}]`;
}

export interface ILrcItem {
  startTime: TimeSpan;
  text: string;
}

export interface IYrcItem {
  startTime: TimeSpan;
  duration: TimeSpan;
  words: Array<{
    startTime: TimeSpan;
    duration: TimeSpan;
    text: string;
  }>;
}
