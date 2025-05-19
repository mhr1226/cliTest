const fs = require("node:fs");
const argv = require("../option.js");
const FileCreator = require("./FileCreator.js");

// ==================================
// HTML生成汎用メソッド
// ベースメソッドはFileSystem.jsに定義
// ファイル共通メソッドはFileCreator.jsに定義
// ==================================

// HTMLのファイル生成
const HtmlCreator = {
  ...FileCreator,

  createHtml: async () => {
    const htmlName = argv.html; // HTMLファイル名
    const htmlExt = "html"; // HTMLファイルの拡張子
    const htmlContent = argv.htmlContent; // HTMLファイルの内容

    console.log("HTMLファイルの生成を開始します。");

    try {
      const html = await FileCreator.createAll({
        fileName: htmlName,
        targetExtension: htmlExt,
        fileContent: htmlContent,
      });


      const result = HtmlCreator.setResult({
        message: `${htmlName}の生成に成功しました。`,
        totalResult: html,
        htmlName: html.addExtAndPathResult.addExtResult.fileName,
        htmlPath: html.addExtAndPathResult.createPathResult.name,
      });
      console.log("===================================");
      console.log(`${htmlName}の生成結果:\n`, result.totalResult);
      return result;

    } catch (err) {
      throw err;
    }
  },
  // CSSファイルをHTMLファイルに読み込む
  loadCssToHtml: async ({ htmlFileName, cssFileName, htmlPath }) => {
    console.log(`作成した${htmlFileName}に${cssFileName}を読み込みます。`);
    try {
      // HTMLファイルの読み込み
      const htmlContent = await fs.promises.readFile(htmlPath, {
        encoding: "utf-8",
      });

      // HTMLの書き換え
      const updatedHtmlContent = htmlContent.replace(
        "</head>",
        `  <link rel="stylesheet" href="./${cssFileName}">\n</head>`
      );

      // 書き換えた内容を保存する
      await fs.promises.writeFile(htmlPath, updatedHtmlContent, {
        encoding: "utf-8",
      });

      const result = HtmlCreator.setResult({
        message: `${htmlFileName}に${cssFileName}の読み込みに成功しました。`,
        htmlFileName: htmlFileName,
        htmlPathName: htmlPath,
        cssFileName: cssFileName,
        beforeHtmlContent: htmlContent.slice(0, 50) + "...", // 先頭50文字を表示
        updatedHtmlContent: updatedHtmlContent.slice(0, 50) + "...", // 先頭50文字を表示
      });
      console.log("===================================");
      console.log(`${htmlFileName}→${cssFileName}の読み込み結果:\n`, result);
      return result;
    } catch (err) {
      throw err;
    }
  },
};

module.exports = HtmlCreator;
