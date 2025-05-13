const HtmlCreator = require("./functions/HtmlCreator.js");
const CssCreator = require("./functions/CssCreator.js");

const argv = require("./option.js");

const main = async () => {

  try {
    // HTMLとCSSファイルを同時生成
  const createHtmlAndCss = await Promise.all([
    HtmlCreator.createHtml(),
    CssCreator.createCss(),
  ]);

  const result = {
    htmlName: createHtmlAndCss[0].htmlName,
    htmlPath: createHtmlAndCss[0].htmlPath,
    cssName: createHtmlAndCss[1].cssName
  };

  // 作成したCSSファイルをHTMLファイルに読み込む
  const loadCss = await HtmlCreator.loadCssToHtml({
    htmlFileName: result.htmlName,
    cssFileName: result.cssName,
    path: result.htmlPath,
  });

  console.log("生成結果：", result);

  return result;
  } catch (mainError) {
    const errorInfo = {
      source: "main",
      name: mainError.name,
      message: "HTMLとCSSの生成に失敗しました。",
      errorMessage: mainError.message,
      actionGuide: "エラーの詳細を確認してください。",
    };

    console.error(new Error(errorInfo.name));
    throw errorInfo;
  }
};

main();
