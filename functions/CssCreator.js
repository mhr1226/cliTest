const argv = require("../option.js");
const resultSystem = require("./resultSystem.js");
const { createAll } = require("./FileCreator.js");

// ==================================
// CSS生成汎用メソッド
// ベースメソッドはFileSystem.jsに定義
// ファイル共通メソッドはFileCreator.jsに定義
// ==================================

// CSSファイルの生成
const CssCreator = {

  createCss: async () => {
    const cssName = argv.css; // cssファイル名
    const cssExt = "css"; // cssファイルの拡張子
    const cssContent = argv.cssContent; // cssファイルの内容

    console.log("CSSファイルの生成を開始します。");

    try {
      const css = await createAll({
        fileName: cssName,
        targetExtension: cssExt,
        fileContent: cssName === "style.css" ? cssContent : "",
      });

      const { addExtResult } = css;

      const result = resultSystem.setResult({
        message: `${addExtResult.fileName}の生成に成功しました。`,
        totalResult: css,
        cssName: addExtResult.fileName,
      });
      console.log(result.message);
      return result;
    } catch (err) {
      throw err;
    }
  },
};

module.exports = CssCreator;
