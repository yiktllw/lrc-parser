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
