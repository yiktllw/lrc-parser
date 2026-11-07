const describe = require("mocha").describe;
const standardizeNcmLrc = require("../dist/index").standardizeNcmLrc;
const parseNcmLrc = require("../dist/index").parseNcmLrc;
const parseNcmYrc = require("../dist/index").parseNcmYrc;
const expect = require("chai").expect;
const examples = require("./lrc_and_yrc_example");

describe("lrc test", () => {
  it("standardize ncm lrc", () => {
    expect(standardizeNcmLrc(examples.lrc)).to.equal(examples.std_lrc_result);
  });
  it("parse NCM LRC", () => {
    expect(JSON.stringify(parseNcmLrc(examples.lrc))).to.equal(
      examples.parse_lrc_result,
    );
  });
});
describe("yrc test", () => {
  it("yrc to IYrcItem", () => {
    expect(JSON.stringify(parseNcmYrc(examples.yrc))).to.equal(
      examples.parse_yrc_result,
    );
  });
});
describe("format guard test", () => {
  it("LRC 文本不会被当成 YRC", () => {
    expect(parseNcmYrc(examples.lrc)).to.deep.equal([]);
  });
  it("只有一行 JSON 信息 + 整行歌词时，YRC 为空、LRC 不丢行", () => {
    const text =
      '{"t":0,"c":[{"tx":"作曲: "},{"tx":"Richard Wagner"}]}\n' +
      "[00:01.196]Mild und leise\n" +
      "[00:14.959]Wie das Auge\n";
    expect(parseNcmYrc(text)).to.deep.equal([]);
    const lines = parseNcmLrc(text);
    expect(lines.length).to.equal(3);
    expect(lines[0].text).to.equal("作曲: Richard Wagner");
    expect(lines[2].text).to.equal("Wie das Auge");
  });
  it("YRC 文本仍然解得出逐字行", () => {
    const yrc = parseNcmYrc(examples.yrc);
    expect(yrc.length).to.be.greaterThan(0);
    expect(yrc[0].words.length).to.be.greaterThan(0);
  });
});
