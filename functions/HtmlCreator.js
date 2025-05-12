const fs = require("node:fs");
const argv = require("../option.js");
const FileCreator = require("./FileCreator.js");

// ==================================
// HTML生成汎用メソッド
// ベースメソッドはFileSystem.jsに定義
// ファイル共通メソッドはFileCreator.jsに定義
// ==================================

// HTMLのファイル生成
const HtmlCreator = Object.assign({}, FileCreator, {
  // プロパティの定義
  htmlName: argv.html, // HTMLファイル名
  htmlExt: "html", // HTMLファイルの拡張子
  htmlContent: argv.htmlContent, // HTMLファイルの内容

  createHtml: async () => {
    const htmlName = argv.html; // HTMLファイル名
    const htmlExt = "html"; // HTMLファイルの拡張子
    const htmlContent = argv.htmlContent; // HTMLファイルの内容

    const html = await FileCreator.createAll({
      fileParameter: htmlName,
      targetExtension: htmlExt,
      fileContent: htmlContent,
    });

    const result = {
      htmlName: html.addExtAndPathResult.addExtResult.fileName,
      htmlPath: html.addExtAndPathResult.createPathResult.name,
    }

    return result;
  },
  // CSSファイルをHTMLファイルに読み込む
  loadCssToHtml: async ({ htmlFileName, cssFileName, path }) => {
    console.log(`作成した${htmlFileName}に${cssFileName}に読み込みます。`);
    try {
      // HTMLファイルの読み込み
      console.log(`${htmlFileName}を読み込み中...`);
      const htmlContent = await fs.promises.readFile(path, {
        encoding: "utf-8",
      });
      console.log(`${htmlFileName}の読み込みが完了しました。`);

      // HTMLの書き換え

      console.log(
        `続いて${htmlFileName}内に${cssFileName}の相対パスを差し込みます。`
      );
      console.log("書き換え中...");
      const updatedHtmlContent = htmlContent.replace(
        "</head>",
        `  <link rel="stylesheet" href="./${cssFileName}">\n</head>`
      );
      console.log(`${htmlFileName}の書き換えに成功しました。`);

      // 書き換えた内容を保存する
      console.log(`書き換えた内容を${htmlFileName}に保存します。`);
      console.log("保存中...");
      // HTMLファイルの上書き保存
      await fs.promises.writeFile(path, updatedHtmlContent, {
        encoding: "utf-8",
      });
      console.log(`${htmlFileName}の保存完了。`);
      console.log(`CSSファイルをHTMLファイルに読み込みました。`);

      return {
        message: `${htmlFileName}に${cssFileName}を読み込みました。`,
        htmlFileName: htmlFileName,
        pathName: path,
        cssFileName: cssFileName,
        beforeContent: htmlContent,
        updatedContent: updatedHtmlContent,
      };
    } catch (loadCssError) {
      const errorInfo = {
        source: "loadCssToHtml",
        name: loadCssError.name,
        message: "処理中にエラーが発生しました。",
        errorMessage: loadCssError.message,
        actionGuide: "エラーの詳細を確認してください。",
      };

      console.error(new Error(errorInfo.name));
      throw errorInfo;
    }
  },
});

module.exports = HtmlCreator;
