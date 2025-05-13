const fs = require("node:fs");
const path = require("node:path");
const argv = require("../option.js");

// ファイル生成オリジナル
const FileSystem = {
  // ファイルの入力チェック
  checkFileName: async (fileName) => {
    console.log(`${fileName}のチェックを行います。`);

    try {
      // ファイル名の入力チェック
      if (!fileName) {
        const error = {
          source: "checkFileName",
          name: "InvalidFileNameError",
          message: "ファイル名が未指定、もしくは無効なファイル名です。",
          actionGuide: "ファイル名を修正してください。",
        };

        console.error(new Error(error.name));

        throw error;
      }
      // ファイル名に相対パスが含まれているかをチェックする
      else if (
        fileName.includes("../") ||
        fileName.includes("..\\") ||
        fileName.includes("/") ||
        fileName.includes("\\")
      ) {
        const error = {
          source: "checkFileName",
          name: "InvalidFileNameError",
          message: "ファイル名にパス区切り文字が含まれています。",
          actionGuide: "ファイル名を修正してください。",
        };

        console.error(new Error(error.name));
        throw error;
      } else {
        // 成功時の処理
        return {
          message: `${fileName}のチェックに成功しました。`,
          name: fileName,
        };
      }
    } catch (checkFileNameError) {
      const errorInfo = {
        source: "checkFileName",
        name: checkFileNameError.name,
        message: "ファイル名のチェックに失敗しました。",
        errorMessage: checkFileNameError.message,
        actionGuide: "エラーの詳細を確認してください。",
      };

      console.error(new Error(errorInfo.name));
      throw errorInfo;
    }
  },

  // ディレクトリの入力チェック
  checkDir: async (dir = argv.dir) => {
    console.log(`${dir}のチェックを行います。`);

    try {
      // dirに空文字列の場合にはエラーを返す
      if (!dir) {
        const error = {
          source: "checkDir",
          name: "InvalidDirError",
          message: "ディレクトリ名が未指定、もしくは無効なディレクトリ名です。",
          actionGuide: "ディレクトリ名を修正してください。",
        };

        console.error(new Error(error.name));
        throw error;
      }
      // dirに危険な文字列が含まれているかをチェックする
      else if (dir.includes("../") || dir.includes("..\\")) {
        const error = {
          source: "checkDir",
          name: "InvalidDirError",
          message: "ディレクトリ名に無効なパスが含まれています。",
          actionGuide: "ディレクトリ名を修正してください。",
        };

        console.error(new Error(error.name));
        throw error;
      } else {
        // 成功時の処理
        return {
          message: `${dir}のチェックに成功しました。`,
          name: dir,
        };
      }
    } catch (checkDirError) {
      const errorInfo = {
        source: "checkDir",
        name: checkDirError.name,
        message: "ディレクトリのチェックに失敗しました。",
        errorMessage: checkDirError.message,
        actionGuide: "エラーの詳細を確認してください。",
      };

      console.error(new Error(errorInfo.name));
      throw errorInfo;
    }
  },

  // ファイルの拡張子チェック
  checkExt: async (fileName) => {
    console.log(`${fileName}の拡張子チェックを行います。`);

    // 入力値の検証
    if (!fileName) {
      const error = {
        source: "checkExt",
        name: "InvalidInputError",
        message: "ファイル名または拡張子が未指定、もしくは無効です。",
        actionGuide: "入力したファイル名と拡張子を確認してください。",
      };

      console.error(new Error(error.name));
      throw error;
    }

    try {
      // 拡張子の取得
      const currentExt = path.extname(fileName);

      // 成功時の処理
      return {
        message: `${fileName}の拡張子チェックに成功しました。`,
        name: currentExt,
      };
    } catch (error) {
      // 拡張子の取得に失敗した場合
      const errorInfo = {
        source: "checkExt",
        name: error.name,
        message: "拡張子の取得に失敗しました。",
        errorMessage: error.message,
        actionGuide: "エラーの詳細を確認してください。",
      };
      console.error(new Error(errorInfo.name));
      throw errorInfo;
    }
  },

  // 拡張子の追加
  addExt: async ({ fileName, fileExt, targetExtension }) => {
    try {
      // 拡張子の取得
      const targetExt = `.${targetExtension}`;

      // 拡張子が存在する場合
      if (fileExt === targetExt) {
        // そのまま返す

        return {
          message: "拡張子は既に指定されています。このまま処理を続けます。",
          fileName: fileName,
          fileExt: fileExt,
        };
      }
      // 拡張子が存在しない場合
      else {
        console.log(`.${targetExtension}拡張子が指定されていません。`);
        console.log(`.${targetExtension}拡張子を追加します。`);

        const addExtFileName = `${fileName}${targetExt}`; // 拡張子を追加

        // 成功時の処理
        return {
          message: `${targetExt}拡張子を追加しました。`,
          originalFileName: fileName,
          fileName: addExtFileName,
          extName: targetExt,
        };
      }
    } catch (error) {
      // その他のエラーが発生した場合
      const errorInfo = {
        source: "unknown",
        name: error.name,
        message: "拡張子の追加に失敗しました。",
        errorMessage: error.message,
        actionGuide: "エラーの詳細を確認してください。",
      };
      console.error(new Error(errorInfo.name));
      throw errorInfo;
    }
  },

  // パスの生成
  createPath: async ({ dir = argv.dir, fileName } = {}) => {
    // ファイルの保存先のパスを作成する
    console.log(`${fileName}のパスを生成します。`);
    try {
      // パスの結合
      const pathResult = path.join(dir, fileName);

      // 成功時の処理
      return {
        message: `${fileName}のパスを生成しました。`,
        name: pathResult,
      };
    } catch (error) {
      const errorInfo = {
        source: "createPath",
        name: error.name,
        message: "パスの生成に失敗しました。",
        errorMessage: error.message,
        actionGuide: "エラーの詳細を確認してください。",
      };
      console.error(new Error(errorInfo.name));
      throw errorInfo;
    }
  },

  // ディレクトリの作成
  createDir: async (dir = argv.dir) => {
    // ディレクトリの存在チェック

    try {
      await fs.promises.access(dir);
      // ディレクトリが存在する場合はそのまま処理を続ける
      return {
        message: "ディレクトリは既に作成されています。このまま処理を続けます。",
      };
    } catch (error) {
      if (error.code === "ENOENT") {
        // ディレクトリが存在しない場合は新規作成する
        console.log(`${dir}ディレクトリが存在しません。`);
        console.log("まずは指定されたディレクトリを新規作成します。");
        // ディレクトリの新規作成

        try {
          console.log("作成中...");

          await fs.promises.mkdir(dir, { recursive: true });

          // 成功時の処理
          return {
            message: "ディレクトリ作成に成功しました。",
          };
        } catch (mkdirError) {
          const errorInfo = {
            source: "createDir",
            name: mkdirError.name,
            message: "ディレクトリの新規作成に失敗しました。",
            errorMessage: mkdirError.message,
            actionGuide: "エラーの詳細を確認してください。",
          };
          console.error(new Error(errorInfo.name));
          throw errorInfo;
        }
      } else {
        // その他のエラーが発生した場合
        const errorInfo = {
          source: "createDir",
          name: error.name,
          message: "ディレクトリの存在確認中にエラーが発生しました。",
          errorMessage: error.message,
          actionGuide: "エラーの詳細を確認してください。",
        };
        console.error(new Error(errorInfo.name));
        throw errorInfo;
      }
    }
  },

  // ファイルの作成
  createFile: async ({ path, fileName, dir = argv.dir, fileContent } = {}) => {
    console.log("ファイルの生成処理を行います。");

    try {
      // ファイルの存在チェック
      await fs.promises.access(path);

      // ファイルが存在する場合
      return {
        message: `${fileName}は既に${dir}内に保存されています。このまま処理を終了します。`,
        fileContent: `${fileContent.slice(0, 50)}...`, // 先頭50文字を表示
      };
    } catch (error) {
      if (error.code === "ENOENT") {
        // ファイルが存在しない場合
        console.log(`${fileName}が存在しない為、${dir}内に新規作成します。`);

        try {
          console.log("ファイル生成中...");

          // ファイルの生成
          await fs.promises.writeFile(path, fileContent, {
            encoding: "utf-8",
          });

          // 成功時の処理
          return {
            message: `${fileName}を${dir}に保存しました。`,
            fileContent: `${fileContent.slice(0, 50)}...`, // 先頭50文字を表示
          };
        } catch (writeFileError) {
          const errorInfo = {
            source: "createFile",
            name: writeFileError.name,
            message: "ファイルの生成に失敗しました。",
            errorMessage: writeFileError.message,
            actionGuide: "エラーの詳細を確認してください。",
          };
          console.error(new Error(errorInfo.name));
          throw errorInfo;
        }
      } else {
        // その他のエラーが発生した場合
        const errorInfo = {
          source: "createFile",
          name: error.name,
          message: "ファイルの生成に失敗しました。",
          errorMessage: error.message,
          actionGuide: "エラーの詳細を確認してください。",
        };
        console.error(new Error(errorInfo.name));
        throw errorInfo;
      }
    }
  },
};

module.exports = FileSystem;
