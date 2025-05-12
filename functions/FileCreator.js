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
  },

  // 拡張子を追加してパスを作成
  addExtAndCreatePath: async ({ fileName, extName, targetExtension }) => {
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
  },

  // ディレクトリとファイルを作成
  createFileAndDir: async ({ path, fileName, fileContent }) => {
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
  },

  // エラー処理
  handleError: (error) => {
    if (!error.source || error.source === undefined) {
      // エラーの発生場所
      const secondStack = error.stack.split("\n")[1];
      console.error(`${secondStack}でエラーが発生しています。`);
      console.error("エラー詳細：", error);
      console.error("処理を終了します。");
    } else {
      // 通常のエラー発生時の処理
      console.error(`${error.source}でエラーが発生しています。`);
      console.error("エラー詳細：", error);
      console.error("処理を終了します。");
    }
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
    }
  },
});

module.exports = FileCreator;
