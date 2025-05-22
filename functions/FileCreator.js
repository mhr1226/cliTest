const fs = require("node:fs");
const argv = require("../option.js");
const FileSystem = require("./FileSystem.js");

// ==================================
// ファイル生成汎用メソッド
// ベースメソッドはFileSystem.jsに定義
// ==================================
const FileCreator = {
  ...FileSystem, 
  // コマンドライン引数の取得
  checkFileParameters: async (fileName) => {
    try {
      const [fileResult, dirResult] = await Promise.all([
        FileSystem.checkFileName(fileName),
        FileSystem.checkDir(),
      ]);

      const extResult = await FileSystem.checkExt(fileResult.name);
      
      return FileCreator.setResult({
        fileResult,
        dirResult,
        extResult,
      });
    } catch (err) {
      throw err;
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

      // パスを作成
      const createPathResult = await FileSystem.createPath({
        fileName: addExtResult.fileName,
      });

      return FileCreator.setResult({
        addExtResult,
        createPathResult,
      });
    } catch (err) {
      throw err;
    }
  },

  // ディレクトリとファイルを作成
  createFileAndDir: async ({ path, fileName, fileContent }) => {
    try {
      // ディレクトリを作成
      const createDirResult = await FileSystem.createDir();

      // ファイルを作成
      const createFileResult = await FileSystem.createFile({
        path: path,
        fileName: fileName,
        fileContent: fileContent,
      });

      return FileCreator.setResult({
        createDirResult,
        createFileResult,
      });
    } catch (err) {
      throw err;
    }
  },

  // ファイル生成：一連の処理
  createAll: async ({ fileName, targetExtension, fileContent }) => {

    // 結果保存用の変数
    let results = {};

    try {
      // ファイル名、ディレクトリ、拡張子の確認
      const checkResult = await FileCreator.checkFileParameters(fileName);

      // 結果の保存
      results = {
        checkResult,
      };

      const { fileResult, extResult } = checkResult;

      // 拡張子を追加してパスを作成
      const addExtAndPathResult = await FileCreator.addExtAndCreatePath({
        fileName: fileResult.name,
        extName: extResult.name,
        targetExtension: targetExtension,
      });

      // 結果の保存
      results = {
        ...results,
        addExtAndPathResult,
      };

      const { addExtResult, createPathResult } = addExtAndPathResult;

      // ディレクトリとファイルを作成
      const createFileAndDirResult = await FileCreator.createFileAndDir({
        path: createPathResult.name,
        fileName: addExtResult.fileName,
        fileContent: fileContent,
      });

      // 結果の保存
      results = {
        ...results,
        createFileAndDirResult,
      };

      return results;
    } catch (err) {
      // エラー内容の出力と最終結果の出力
      err.result = results;
      throw err;
    }
  },
};

module.exports = FileCreator;
