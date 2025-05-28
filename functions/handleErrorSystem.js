// ===========================================
// エラーハンドリング用のメソッド
// FileSystem及びFileCreatorで使用
// ===========================================

const handleErrorSystem = {
  // カスタムエラーの作成
  setCustomError: ({
    source = null,
    name,
    message = `${name}が発生しました。`,
    actionGuide = `${name}の詳細を確認してください。`,
  } = {}) => {
    // エラー情報をセット
    return {
      source,
      name,
      message,
      actionGuide,
    };
  },

  // カスタムエラーのreturn
  returnCustomError: (errorInfo) => {
    // errorInfoの内容を展開
    const { source, name, message, actionGuide } = errorInfo;

    // エラーオブジェクトの作成
    const error = new Error(name);

    // errorの拡張
    error.source = source;
    error.customName = name;
    error.customMessage = message;
    error.actionGuide = actionGuide;

    return error;
  },

  // カスタムエラーの統合メソッド
  setCustomErrorAll: ({
    source = null,
    name,
    message = `${name}が発生しました。`,
    actionGuide = `${name}の詳細を確認してください。`,
  } = {}) => {
    // エラー情報をセット
    const errorInfo = {
      source,
      name,
      message,
      actionGuide,
    };

    // エラーオブジェクトの完成版をreturnする
    return handleErrorSystem.returnCustomError(errorInfo);
  },

  // エラーリストのエラーオブジェクト化
  setTotalError: async (err, errorName) => {
    const error = new Error("ファイル生成中にエラーが発生しました。");

    error.details = err;
    error.errorName = errorName;

    return error;
  },

  // 収集したエラーのログ出力
  setErrorLogs: async (err) => {
    // エラーリスト内のループ処理
    err.details.map((err) => {
      // カスタムエラーの場合
      if (err.source) {
        console.error(`${err.source}で${err.customName}が発生しました。\n`);
        console.error("エラー名：", err.customName);
        console.error("エラーの発生元：", err.source);
        console.error("エラーの内容：", err.customMessage);
        console.error("エラーの対処方法：", err.actionGuide);
      } else {
        console.error(`${err.name}が発生しました。`);
      }
      // 結果の出力
      console.error("処理を中断し、途中までの結果を出力します。\n");

      console.error("===========================================");
      console.error("途中結果：", err.results, "\n");
      console.error("エラー詳細：\n", err);
    });
  },
};

module.exports = handleErrorSystem;
