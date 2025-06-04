const FileCreator = require("./functions/FileCreator.js");
const HtmlCreator = require("./functions/HtmlCreator.js");
const CssCreator = require("./functions/CssCreator.js");
const serverSystem = require("./functions/serverSystem.js");

const argv = require("./option.js");

const createTest = async () => {
  // 結果保存用のメソッド
  const setTotalResults = async ({
    result = {},
    errors = [],
    successResults = [],
    errorName = null,
    successName = null,
  } = {}) => {
    // 成功・失敗の結果を保存
    const results = {
      success: true,
      successName: null,
      totalResult: null,
      successResults: successResults,
      errors: errors,
    };

    // ============================
    // 成功・失敗時の結果の保存処理
    // ============================
    // 引数resultの結果が失敗した場合
    if (result.status === "rejected") {
      // 途中結果の取得
      results.totalResult = {
        // createAllの結果を展開
        ...result.reason.results,
      };
      // エラー情報の取得
      const errorInfo = result.reason;
      // エラー名の設定
      errorInfo.errorName = errorName;

      // エラーをリストに追加
      results.errors.push(errorInfo);

      results.success = false;
      // 成功した場合
    } else {
      // 引数resultの内容の保存
      results.totalResult = result.value
        ? {
            ...result.value.totalResult,
          }
        : {
            ...result,
          };
      // 成功時の名前の設定
      results.successName = successName;
      // 成功した場合の結果をresultsに追加
      results.successResults.push(results);
    }

    return results;
  };

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
      setTotalResults({
        result: htmlResult,
        errors: errorResults,
        successResults: successResults,
        errorName: "htmlError",
        successName: "htmlSuccess",
      }),
      setTotalResults({
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
      // 作成したCSSファイルをHTMLファイルに読み込む

      try {
        const loadCss = await HtmlCreator.loadCssToHtml({
          htmlFileName: settledHtmlResult.addExtResult.fileName,
          cssFileName: settledCssResult.addExtResult.fileName,
          htmlPath: settledHtmlResult.createPathResult.name,
        });
        // 結果の保存
        const settledLoadCssResult = await setTotalResults({
          result: loadCss,
          errors: errorResults,
          successResults: successResults,
          errorName: "loadCssError",
          successName: "loadCssSuccess",
        });

        if (settledLoadCssResult.success) {
          console.log("CSSファイルの読み込みに成功しました。");
          // サーバーの起動
          console.log("サーバーを起動します。");

          try {
            const serverResult = await serverSystem.startServer({
              fileDir: settledHtmlResult.dirResult.dir,
              htmlFileName: settledHtmlResult.addExtResult.fileName,
            });
            // サーバー起動の結果を保存
            await setTotalResults({
              result: serverResult,
              errors: errorResults,
              successResults: successResults,
              errorName: "serverError",
              successName: "serverSuccess",
            });
          } catch (err) {
            throw err;
          }
        }
      } catch (err) {
        throw err;
      }
    }

    // エラー情報がある場合
    if (errorResults.length > 0) {
      // 収集したエラーリストをエラーオブジェクトに格納
      const error = await FileCreator.setTotalError(
        errorResults,
        "createTestError"
      );

      // エラー情報の出力
      await FileCreator.setErrorLogs(error);

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
          result.totalResult
        );
      });
    }
  } catch (err) {
    // 関数の終点
    console.error("==========================================");
    console.error("処理を終了します。");
  }
};

const createResult = createTest();
