const FileCreator = require("./functions/FileCreator.js");
const HtmlCreator = require("./functions/HtmlCreator.js");
const CssCreator = require("./functions/CssCreator.js");

const argv = require("./option.js");

const test = async () => {
  try {
    console.log("testを実行します。");

    const error = FileCreator.setCustomError({
      source: "test",
      name: "TestError",
    });

    if (error) {
      // エラーログの出力
      FileCreator.setCustomLogs(error);
      throw new Error(error.actionGuide);
    }

    const result = {
      htmlName: argv.html,
      cssName: argv.css,
    };
    console.log(result);
  } catch (err) {
    
    // エラー状況に応じたログを出力
    FileCreator.setCatchErrorLog(err);
  }
};

test();

// const main = async () => {
//   try {
//     // HTMLとCSSファイルを同時生成
//     const createHtmlAndCss = await Promise.all([
//       HtmlCreator.createHtml(),
//       CssCreator.createCss(),
//     ]);

//     const result = {
//       htmlName: createHtmlAndCss[0].htmlName,
//       htmlPath: createHtmlAndCss[0].htmlPath,
//       cssName: createHtmlAndCss[1].cssName,
//     };

//     // 作成したCSSファイルをHTMLファイルに読み込む
//     const loadCss = await HtmlCreator.loadCssToHtml({
//       htmlFileName: result.htmlName,
//       cssFileName: result.cssName,
//       path: result.htmlPath,
//     });

//     console.log("生成結果：", result);

//     return result;
//   } catch (err) {
//     // エラー情報をセット
//     console.log(`mainのエラー出力を確認します。`);
//     console.error(JSON.stringify(err));
//     throw FileCreator.setError(err);
//   }
// };

// main();
