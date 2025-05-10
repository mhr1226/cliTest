const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const path = require("node:path");
const package = require("./package.json");
const { html, css } = require("./datas/filesDefaultData.js");
require("dotenv").config();

const defaultConfig = {
  baseDir: process.env.BASE_DIR || ".",
  fileDir: process.env.FILE_DIR || "./src",
}

const argv = yargs(hideBin(process.argv))
  .option("name", {
    type: "string",
    description: "CLIの名前を表示",
    default: package.name,
  })
  .option("dir", {
    type: "string",
    describe: "ファイルを保存するディレクトリのパス",
    default: defaultConfig.fileDir,
  })
  .option("html", {
    type: "string",
    describe: "HTMLファイルの名前",
    default: "index.html",
  })
  .option("css", {
    type: "string",
    describe: "CSSファイルの名前",
    default: "style.css",
  })
  .option("htmlContent", {
    type: "string",
    describe: "htmlファイルのパス",
    default: html.content,
  })
  .option("cssContent", {
    type: "string",
    describe: "cssファイルのパス",
    default: css.content,
  })
  .help().argv;

module.exports = argv;
