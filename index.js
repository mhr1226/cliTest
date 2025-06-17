const handleErrorSystem = require("./functions/handleErrorSystem.js");
const HtmlCreator = require("./functions/HtmlCreator.js");
const CssCreator = require("./functions/CssCreator.js");
const serverSystem = require("./functions/serverSystem.js");
const resultSystem = require("./functions/resultSystem.js");

const createTest = async () => {
  // 結果保存用の配列
  const successResults = [];

  // エラー保存用の配列
  const errorResults = [];

  try {
    // HTMLとCSSファイルを同時生成
    const [htmlResult, cssResult] = await Promise.allSettled([
      HtmlCreator.createHtml(),
      CssCreator.createCss(),
    ]);

    // 結果の保存
    const [
      { success: htmlSuccess, totalResult: settledHtmlResult },
      { success: cssSuccess, totalResult: settledCssResult },
    ] = await Promise.all([
      resultSystem.setTotalResults({
        result: htmlResult,
        errors: errorResults,
        successResults: successResults,
        errorName: "htmlError",
        successName: "htmlSuccess",
      }),
      resultSystem.setTotalResults({
        result: cssResult,
        errors: errorResults,
        successResults: successResults,
        errorName: "cssError",
        successName: "cssSuccess",
      }),
    ]);

    // HTML,CSSファイルの生成に成功した場合
    if (htmlSuccess && cssSuccess) {
      console.log("HTMLとCSSファイルの生成に成功しました。");

      // CSSファイルの読み込みとサーバーの起動
      console.log("CSSファイルをHTMLに読み込み、サーバーを起動します。");
      const [loadCssResult, startServerResult] = await Promise.allSettled([
        // CSSファイルをHTMLに読み込む
        HtmlCreator.loadCssToHtml({
          htmlFileName: settledHtmlResult.addExtResult.fileName,
          cssFileName: settledCssResult.addExtResult.fileName,
          htmlPath: settledHtmlResult.createPathResult.name,
        }),
        // サーバーの起動
        serverSystem.startServer({
          fileDir: settledHtmlResult.dirResult.dir,
          htmlFileName: settledHtmlResult.addExtResult.fileName,
        }),
      ]);

      // 結果の保存
      const [{ success: loadCssSuccess }, { success: serverSuccess }] =
        await Promise.all([
          resultSystem.setTotalResults({
            result: loadCssResult,
            errors: errorResults,
            successResults: successResults,
            errorName: "loadCssError",
            successName: "loadCssSuccess",
          }),
          resultSystem.setTotalResults({
            result: startServerResult,
            errors: errorResults,
            successResults: successResults,
            errorName: "serverError",
            successName: "serverSuccess",
          }),
        ]);

      // 処理結果の出力
      if (loadCssSuccess) {
        console.log("CSSファイルの読み込みに成功しました。");
      } else {
        console.error("CSSファイルの読み込みに失敗しました。");
      }

      if (serverSuccess) {
        console.log("サーバーの起動に成功しました。");
      } else {
        console.error("サーバーの起動に失敗しました。");
      }
    }

    // エラー情報がある場合
    if (errorResults.length > 0) {
      // 収集したエラーリストをエラーオブジェクトに格納
      const error = await handleErrorSystem.setTotalError(errorResults, "createTestError");

      // エラー情報の出力
      await handleErrorSystem.setErrorLogs(error);

      throw error;
    }
    // 成功時の処理
    else {
      // 結果の出力
      console.log("最終結果：");
      successResults.map((result, index) => {
        console.log(
          `${
            result.successName ? result.successName : result.Promise.successName
          }結果:`,
          result.totalResult ? result.totalResult : result.Promise.totalResult
        );
      });
      console.log("全ての処理が正常に完了しました。");
    }
  } catch (err) {
    // 関数の終点
    console.error("==========================================");
    console.error(err);
    console.error("処理を終了します。");
  }
};

const createResult = createTest();
