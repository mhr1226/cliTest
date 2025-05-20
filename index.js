const FileCreator = require("./functions/FileCreator.js");
const HtmlCreator = require("./functions/HtmlCreator.js");
const CssCreator = require("./functions/CssCreator.js");

const argv = require("./option.js");

const createTest = async () => {

  let results = {};

  try {

    // HTMLとCSSファイルを同時生成
    const [htmlResult, cssResult] = await Promise.all([
      HtmlCreator.createHtml(),
      CssCreator.createCss(),
    ]);

    const htmlTotalResult = htmlResult.totalResult;
    const cssTotalResult = cssResult.totalResult;

    // 結果の保存
    results = {
      htmlResult,
      cssResult,
    }
    
    // 作成したCSSファイルをHTMLファイルに読み込む
    const loadCss = await HtmlCreator.loadCssoHtml({
      htmlFileName: htmlTotalResult.addExtAndPathResult.addExtResult.fileName,
      cssFileName: cssTotalResult.addExtAndPathResult.addExtResult.fileName,
      htmlPath: htmlTotalResult.addExtAndPathResult.createPathResult.name,
    });

    // 結果の保存
    results = {
      ...results,
      loadCss
    }

    console.log("全ての処理が完了したので、終了します。");

  } catch (err) {
    // 関数の終点
  }
};

createTest();