const fs = require("node:fs");
const argv = require("../option.js");
const FileCreator = require("./FileCreator.js");

// ==================================
// CSS生成汎用メソッド
// ベースメソッドはFileSystem.jsに定義
// ファイル共通メソッドはFileCreator.jsに定義
// ==================================

// CSSファイルの生成
const CssCreator = Object.assign({}, FileCreator, {
  createCss: async () => {
    const cssName = argv.css; // cssファイル名
    const cssExt = "css"; // cssファイルの拡張子
    const cssContent = argv.cssContent; // cssファイルの内容

    try {
      const css = await FileCreator.createAll({
        fileParameter: cssName,
        targetExtension: cssExt,
        fileContent: cssContent,
      });

      const result = {
        cssName: css.addExtAndPathResult.addExtResult.fileName,
      };

      return result;
    } catch (createCssError) {
      const errorInfo = {
        source: "createCss",
        name: createCssError.name,
        message: "CSSファイルの生成に失敗しました。",
        errorMessage: createCssError.message,
        actionGuide: "エラーの詳細を確認してください。",
      };

      console.error(new Error(errorInfo.name));
      throw errorInfo;
    }
  },
});

module.exports = CssCreator;
