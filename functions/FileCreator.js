const fs = require("node:fs");
const argv = require("../option.js");
const FileSystem = require("./FileSystem.js");

// ==================================
// ファイル生成汎用メソッド
// ベースメソッドはFileSystem.jsに定義
// ==================================
const FileCreator = Object.assign({}, FileSystem, {
  // コマンドライン引数の取得
  checkFileParameters: async (fileName) => {
    try {
      const [fileResult, dirResult] = await Promise.all([
        FileSystem.checkFileName(fileName),
        FileSystem.checkDir(),
      ]);

      console.log("ファイル名結果：", fileResult);
      console.log("ディレクトリ結果：", dirResult);

      const extResult = await FileSystem.checkExt(fileResult.name);
      const result = {
        fileResult,
        dirResult,
        extResult,
      };
      return result;
    } catch (checkFileParametersError) {
      const errorInfo = {
        source: "checkFileParameters",
        name: checkFileParametersError.name,
        message: "ファイル名のチェックに失敗しました。",
        errorMessage: checkFileParametersError.message,
        actionGuide: "エラーの詳細を確認してください。",
      };

      console.error(new Error(errorInfo.name));
      throw errorInfo;
    }
  },

  // 拡張子を追加してパスを作成
  addExtAndCreatePath: async ({ fileName, extName, targetExtension }) => {
    try {
      // 拡張子を追加
      const addExtResult = await FileSystem.addExt({
        fileName: fileName,
        fileExt: extName,
        targetExtension: targetExtension,
      });

      console.log("拡張子結果：", addExtResult);

      // パスを作成
      const createPathResult = await FileSystem.createPath({
        fileName: addExtResult.fileName,
      });

      console.log("パス作成結果：", createPathResult);

      const result = {
        addExtResult,
        createPathResult,
      };
      return result;
    } catch (addExtAndCreatePathError) {
      const errorInfo = {
        source: "addExtAndCreatePath",
        name: addExtAndCreatePathError.name,
        message: "拡張子の追加とパスの作成に失敗しました。",
        errorMessage: addExtAndCreatePathError.message,
        actionGuide: "エラーの詳細を確認してください。",
      };

      console.error(new Error(errorInfo.name));
      throw errorInfo;
    }
  },

  // ディレクトリとファイルを作成
  createFileAndDir: async ({ path, fileName, fileContent }) => {
    try {
      // ディレクトリを作成
      const createDirResult = await FileSystem.createDir();
      console.log("ディレクトリ作成結果：", createDirResult);

      // ファイルを作成
      const createFileResult = await FileSystem.createFile({
        path: path,
        fileName: fileName,
        fileContent: fileContent,
      });

      console.log("ファイル作成結果：", createFileResult);

      const result = {
        createDirResult,
        createFileResult,
      };

      return result;
    } catch (createFileAndDirError) {
      const errorInfo = {
        source: "createFileAndDir",
        name: createFileAndDirError.name,
        message: "ディレクトリとファイルの作成に失敗しました。",
        errorMessage: createFileAndDirError.message,
        actionGuide: "エラーの詳細を確認してください。",
      };

      console.error(new Error(errorInfo.name));
      throw errorInfo;
    }
  },

  // エラー処理
  handleError: (error) => {
    try {
      // errorが存在しない、または予期しない型の場合
      if (!error || typeof error !== "object") {
        console.error(
          "不明なエラーが発生しました。エラーオブジェクトが存在しません。"
        );
        console.error("処理を終了します。");
      }
      // error.sourceが存在しない場合
      else if (!error.source) {
        // エラーの発生場所を特定する
        try {
          // 2行目（エラー発生元）のスタック情報とエラー全体の取得
          const secondStack = error.stack.split("\n")[1];
          console.error(`${secondStack}でエラーが発生しています。`);
          console.error("エラー詳細：", error);
          console.error("処理を終了します。");
        } catch (getStackError) {
          // stackプロパティの取得に失敗した場合
          console.error("スタック情報の取得に失敗しました。");
          console.error("エラー詳細：", getStackError);
          console.error("処理を終了します。");
          return;
        }
      } else {
        // 通常のエラー発生時の処理
        console.error(`${error.source}でエラーが発生しています。`);
        console.error("エラー詳細：", error);
        console.error("処理を終了します。");
      }
    } catch (handleError) {
      // エラー処理中にエラーが発生した場合
      console.error("エラー処理中にエラーが発生しました。");
      console.error("エラー詳細：", handleError);
      console.error("処理を終了します。");
      return;
    }
    return;
  },

  // ファイル生成：一連の処理
  createAll: async ({ fileParameter, targetExtension, fileContent }) => {
    try {
      // ファイル名、ディレクトリ、拡張子の確認
      const checkResult = await FileCreator.checkFileParameters(fileParameter);

      const { fileResult, extResult } = checkResult;

      // 拡張子を追加してパスを作成
      const addExtAndPathResult = await FileCreator.addExtAndCreatePath({
        fileName: fileResult.name,
        extName: extResult.name,
        targetExtension: targetExtension,
      });

      const { addExtResult, createPathResult } = addExtAndPathResult;

      // ディレクトリとファイルを作成
      const createFileAndDirResult = await FileCreator.createFileAndDir({
        path: createPathResult.name,
        fileName: addExtResult.fileName,
        fileContent: fileContent,
      });

      const result = {
        checkResult,
        addExtAndPathResult,
        createFileAndDirResult,
      };

      console.log("全ての処理が完了したので、終了します。");

      return result;
    } catch (error) {
      // 不明なエラー発生時の処理
      FileCreator.handleError(error);
      throw error;
    }
  },
});

module.exports = FileCreator;
