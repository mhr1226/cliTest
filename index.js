const {
  FileCreator,
  createHtml,
  createCss,
} = require("./functions/FileCreator.js");

const argv = require("./option.js");



FileCreator.createAll({
  fileParameter: argv.css,
  targetExtension: "css",
  fileContent: argv.cssContent
});
