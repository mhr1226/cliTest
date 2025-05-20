const FileCreator = require("./functions/FileCreator.js");
const HtmlCreator = require("./functions/HtmlCreator.js");
const CssCreator = require("./functions/CssCreator.js");

const argv = require("./option.js");

const createTest = async () => {
  // 成功時の結果保存用の変数
  let results = {};

  try {
    // HTMLとCSSファイルを同時生成
    const [htmlResult, cssResult] = await Promise.allSettled([
      HtmlCreator.createHtml(),
      CssCreator.createCss(),
    ]);

    // エラー情報保存用の変数
    const errors = [];

    // 処理結果確認用の変数
    let htmlSuccess = false;
    let cssSuccess = false;

    // HtmlCreatorの結果が失敗した場合
    if (htmlResult.status === "rejected") {

      // エラー情報を保存
      const htmlError = {
        name: "HTMLファイルの生成",
        message: "HTMLファイルの生成に失敗しました。",
        error: htmlResult.reason,
      };
      // エラー情報をエラーリストに追加
      errors.push(htmlError);
      console.log(errors);
      console.error("HTMLファイルの生成に失敗しました。");
    } else {
      htmlSuccess = true;
      console.log("HTMLファイルの生成に成功しました。");
    }

    // 結果の保存
    results = {
      htmlResult,
      cssResult,
    };

    // 作成したCSSファイルをHTMLファイルに読み込む
    const loadCss = await HtmlCreator.loadCssoHtml({
      htmlFileName: htmlTotalResult.addExtAndPathResult.addExtResult.fileName,
      cssFileName: cssTotalResult.addExtAndPathResult.addExtResult.fileName,
      htmlPath: htmlTotalResult.addExtAndPathResult.createPathResult.name,
    });

    // 結果の保存
    results = {
      ...results,
      loadCss,
    };

    console.log("全ての処理が完了したので、終了します。");
  } catch (err) {
    // 関数の終点
  }
};

createTest();
