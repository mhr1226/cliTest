const FileCreator = require("./functions/FileCreator.js");
const HtmlCreator = require("./functions/HtmlCreator.js");
const CssCreator = require("./functions/CssCreator.js");

const argv = require("./option.js");

const createTest = async () => {
  // エラー情報保存用の変数
  const errors = [];
  // エラー名保存用の変数
  const errorName = [];

  // 成功時の結果保存用の変数
  const successResults = [];
  // 結果の名前保存用の変数
  const resultName = [];

  try {
    // HTMLとCSSファイルを同時生成
    const [htmlResult, cssResult] = await Promise.allSettled([
      HtmlCreator.createHtml(),
      CssCreator.createCss(),
    ]);

    // 処理結果確認用の変数
    let htmlSuccess = false;
    let cssSuccess = false;

    // HtmlCreatorの結果が失敗した場合
    if (htmlResult.status === "rejected") {
      // 途中結果の取得
      const htmlSuccessResult = {
        ...htmlResult.reason.result,
      };
      // エラー情報の取得
      const htmlError = htmlResult.reason;

      // エラーログの出力
      HtmlCreator.setCatchErrorLogs(htmlError, htmlSuccessResult);
      // エラー情報をエラーリストに追加
      errors.push(htmlError);
      errorName.push("htmlError");
      // 成功した場合
    } else {
      htmlSuccess = true;
      successResults.push(htmlResult.value.totalResult);
      resultName.push("htmlResult");
      console.log(htmlResult.value.message);
    }

    // CssCreatorの結果が失敗した場合
    if (cssResult.status === "rejected") {
      // 途中結果の取得
      const cssSuccessResult = {
        ...cssResult.reason.result,
      };
      // エラー情報の取得
      const cssError = cssResult.reason;

      // エラーログの出力
      CssCreator.setCatchErrorLogs(cssError, cssSuccessResult);
      // エラー情報をエラーリストに追加
      errors.push(cssError);
      errorName.push("cssError");
      console.error("CSSファイルの生成に失敗しました。");
      // 成功した場合
    } else {
      cssSuccess = true;
      successResults.push(cssResult.value.totalResult);
      resultName.push("cssResult");
      console.log(cssResult.value.message);
    }

    // エラー情報がある場合
    if (errors.length > 0) {
      console.error("エラー情報を取得しました。");

      errors.map((err, index) => {
        console.error(`${errorName[index]}：`, err);
      });
      throw errors;
    }

    // 作成したCSSファイルをHTMLファイルに読み込む
    const loadCss = await HtmlCreator.loadCssToHtml({
      htmlFileName:
        htmlResult.value.totalResult.addExtAndPathResult.addExtResult.fileName,
      cssFileName:
        cssResult.value.totalResult.addExtAndPathResult.addExtResult.fileName,
      htmlPath:
        htmlResult.value.totalResult.addExtAndPathResult.createPathResult.name,
    });

    // 結果の保存
    successResults.push(loadCss);
    resultName.push("loadCssResult");

    // 結果の出力
    console.log("最終結果：");
    successResults.map((result, index) => {
      console.log(`${resultName[index]}結果:`, result);
    });
    console.log("全ての処理が完了したので、終了します。");
  } catch (err) {
    // 関数の終点
    if (errors.length === 0) {
      // 想定外のエラーが発生した場合
      console.error(err);
    }
  }
};

createTest();
