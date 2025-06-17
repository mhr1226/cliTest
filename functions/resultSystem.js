// ===========================================
// 結果管理用のメソッド
// 処理結果の保存・管理を行う
// ===========================================

const resultSystem = {

  // 成功時のオブジェクトを保存
  setResult: (result) => {
    return result;
  },

  // 加工前の結果を保存するためのメソッド
  setBaseResults: ({ errors, successResults }) => {
    return {
      success: true,
      successName: null,
      totalResult: null,
      successResults: successResults,
      errors: errors,
    };
  },

  // 成功時の結果を保存するためのメソッド
  setSuccessResults: ({ result, successName, baseResults }) => {
    // 引数resultの内容の保存
    const totalResult = result.value
      ? {
          ...result.value.totalResult,
        }
      : {
          ...result.value,
        };

    // 結果の更新
    const results = {
      ...baseResults,
      success: true,
      successName: successName,
      totalResult: totalResult,
    };
    // 成功した場合の結果をresultsに追加
    results.successResults.push(results);

    return results;
  },

  // エラー時：
  // 途中結果の取得とエラー情報の保存メソッド
  setErrorResults: ({ result, errorName, baseResults }) => {
    // 途中結果の取得
    const totalResult = {
      // createAllの結果を展開
      ...result.reason.results,
    };
    // エラー情報の取得
    const errorInfo = {
      ...result.reason,
      // エラー名の設定
      errorName: errorName,
    }

    // 結果の更新
    const results = {
      ...baseResults,
      success: false,
      totalResult: totalResult,
    };

    // エラーをリストに追加
    results.errors.push(errorInfo);

    return results;
  },

  // 結果保存用のメソッド
  setTotalResults: async ({
    result = {},
    errors = [],
    successResults = [],
    errorName = null,
    successName = null,
  } = {}) => {
    // 成功・失敗時の結果保存用オブジェクト
    const results = resultSystem.setBaseResults({
      errors: errors,
      successResults: successResults,
    });

    // ============================
    // 成功・失敗時の結果の保存処理
    // ============================
    // 失敗した場合
    if (result.status === "rejected") {
      // エラー情報の保存
      return resultSystem.setErrorResults({
        result: result,
        errorName: errorName,
        baseResults: results,
      });
      // 成功した場合
    } else {
      return resultSystem.setSuccessResults({
        result: result,
        successName: successName,
        baseResults: results,
      });
    }
  },
};

module.exports = resultSystem;
