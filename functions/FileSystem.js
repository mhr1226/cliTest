const fs = require("node:fs");
const path = require("node:path");
const argv = require("../option.js");
const handleErrorSystem = require("./handleErrorSystem.js");

// ============================================
// ファイル生成オリジナル
// ファイル生成の基本メソッドの集まり
// FileSystemのメソッドを使用してファイルを生成する
// ============================================
const FileSystem = {

  // エラーハンドリング用のメソッドをインポート
  ...handleErrorSystem,
  
// 成功時のオブジェクトを保存
  setResult: (result) => {
    return result;
  },

  // ファイルの入力チェック
  checkFileName: async (fileName) => {
    try {
      // ファイル名の入力チェック
      if (!fileName) {
        throw FileSystem.setCustomErrorAll({
          source: "checkFileName",
          name: "InvalidFileNameError",
          message: "ファイル名が未指定、もしくは無効なファイル名です。",
          actionGuide: "ファイル名を修正してください。",
        });
      }
      // ファイル名に相対パスが含まれているかをチェックする
      else if (
        fileName.includes("../") ||
        fileName.includes("..\\") ||
        fileName.includes("/") ||
        fileName.includes("\\")
      ) {
        throw FileSystem.setCustomErrorAll({
          source: "checkFileName",
          name: "ReferenceError",
          message: "ファイル名に無効なパスが含まれています。",
          actionGuide: "ファイル名を修正してください。",
        });
      } else {
        // 成功時の処理
        return FileSystem.setResult({
          message: `ファイルの入力チェックに成功しました。`,
          name: fileName,
        });
      }
    } catch (err) {
      throw err;
    }
  },

  // ディレクトリの入力チェック
  checkDir: async (dir = argv.dir) => {
    try {
      // dirに空文字列の場合にはエラーを返す
      if (!dir) {
        throw FileSystem.setCustomErrorAll({
          source: "checkDir",
          name: "InvalidDirError",
          message: "ディレクトリ名が未指定、もしくは無効なディレクトリ名です。",
          actionGuide: "ディレクトリ名を修正してください。",
        });
      }
      // dirに危険な文字列が含まれているかをチェックする
      else if (dir.includes("../") || dir.includes("..\\")) {
        throw FileSystem.setCustomErrorAll({
          source: "checkDir",
          name: "InvalidDirError",
          message: "ディレクトリ名に無効なパスが含まれています。",
          actionGuide: "ディレクトリ名を修正してください。",
        });
      } else {
        // 成功時の処理
        return FileSystem.setResult({
          message: `ディレクトリの入力チェックに成功しました。`,
          name: dir,
        });
      }
    } catch (err) {
      throw err;
    }
  },

  // ファイルの拡張子チェック
  checkExt: async (fileName) => {
    // 入力値の検証
    if (!fileName) {
      throw FileSystem.setCustomErrorAll({
        source: "checkExt",
        name: "InvalidInputError",
        message: "ファイル名が未指定、もしくは無効です。",
        actionGuide: "入力したファイル名を確認してください。",
      });
    }

    try {
      // 拡張子の取得
      const currentExt = path.extname(fileName);

      // 成功時の処理
      return FileSystem.setResult({
        message: `${fileName}の拡張子を取得しました。`,
        name: currentExt,
      });
    } catch (err) {
      // 拡張子の取得に失敗した場合
      throw err;
    }
  },

  // 拡張子の追加
  addExt: async ({ fileName, fileExt, targetExtension } = {}) => {
    try {
      // 拡張子の取得
      const targetExt = `.${targetExtension}`;

      // 拡張子が存在する場合
      if (fileExt === targetExt) {
        // そのまま返す

        return FileSystem.setResult({
          message: "拡張子は既に指定されています。このまま処理を続けます。",
          fileName: fileName,
          fileExt: fileExt,
        });
      }
      // 拡張子が存在しない場合
      else {
        console.log(`.${targetExtension}拡張子が指定されていません。`);
        console.log("拡張子を追加します。");

        // 拡張子の追加
        const addExtFileName = `${fileName}${targetExt}`;

        // 成功時の処理
        return FileSystem.setResult({
          message: `${targetExt}拡張子を追加しました。`,
          originalFileName: fileName,
          fileName: addExtFileName,
          extName: targetExt,
        });
      }
    } catch (err) {
      // その他のエラーが発生した場合
      throw err;
    }
  },

  // パスの生成
  createPath: async ({ dir = argv.dir, fileName } = {}) => {
    // ファイルの保存先のパスを作成する
    try {
      // パスの結合
      const pathResult = path.join(dir, fileName);

      // 成功時の処理
      return FileSystem.setResult({
        message: `${fileName}のパスを生成しました。`,
        name: pathResult,
      });
    } catch (err) {
      throw err;
    }
  },

  // ディレクトリの作成
  createDir: async (dir = argv.dir) => {
    // ディレクトリの存在チェック

    try {
      await fs.promises.access(dir);
      // ディレクトリが存在する場合はそのまま処理を続ける
      return FileSystem.setResult({
        message: "ディレクトリは既に作成されています。このまま処理を続けます。",
        dir: dir,
      });
    } catch (err) {
      if (err.code === "ENOENT") {
        // ディレクトリが存在しない場合は新規作成する
        console.log(`${dir}ディレクトリが存在しません。`);
        console.log("指定されたディレクトリを新規作成します。");

        // ディレクトリの新規作成
        try {
          console.log("作成中...");

          await fs.promises.mkdir(dir, { recursive: true });

          // 成功時の処理
          return {
            message: "ディレクトリ作成に成功しました。",
            dir: dir,
          };
        } catch (err) {
          throw err;
        }
      } else {
        // その他のエラーが発生した場合
        throw err;
      }
    }
  },

  // ファイルの作成
  createFile: async ({ path, fileName, dir = argv.dir, fileContent } = {}) => {
    try {
      // ファイルの存在チェック
      await fs.promises.access(path);

      // ファイルが存在する場合
      return FileSystem.setResult({
        message: `${fileName}は既に${dir}内に保存されています。このまま処理を終了します。`,
        path: path,
        fileName: fileName,
        dir: dir,
        fileContent: `${fileContent.slice(0, 50)}...`, // 先頭50文字を表示
      });
    } catch (err) {
      if (err.code === "ENOENT") {
        // ファイルが存在しない場合
        console.log(`${fileName}が存在しない為、${dir}内に新規作成します。`);

        try {
          console.log("ファイル生成中...");

          // ファイルの生成
          await fs.promises.writeFile(path, fileContent, {
            encoding: "utf-8",
          });

          // 成功時の処理
          return FileSystem.setResult({
            message: `${fileName}を${dir}に保存しました。`,
            path: path,
            fileName: fileName,
            dir: dir,
            fileContent: `${fileContent.slice(0, 50)}...`, // 先頭50文字を表示
          });
        } catch (err) {
          throw err;
        }
      } else {
        // その他のエラーが発生した場合
        throw err;
      }
    }
  },
};

module.exports = FileSystem;
