const fs = require("node:fs");
const path = require("node:path");
const argv = require("../option.js");

// ファイル生成オリジナル
const createFs = {
  // ファイルの入力チェック
  checkFileName: (fileName) => {
    console.log("ファイル名のチェックを行います。");

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
      return Promise.resolve({
        // 成功時の処理
        message: "ファイル名のチェックに成功しました。",
        fileName: fileName,
      });
    }
  },

  // ディレクトリの入力チェック
  checkDir: (dir = argv.dir) => {
    console.log("ディレクトリ名のチェックを行います。");

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
      return Promise.resolve({
        message: "ディレクトリ名のチェックに成功しました。",
        dir: dir,
      });
    }
  },

  // ディレクトリの新規作成
  createDir: (dir) => {
    // ディレクトリの存在チェック
    return (
      fs.promises
        .access(dir)
        // ディレクトリが存在する場合はそのまま処理を続ける
        .then(() => ({
          message:
            "ディレクトリは既に作成されています。このまま処理を続けます。",
        }))
        .catch((error) => {
          if (error.code === "ENOENT") {
            // ディレクトリが存在しない場合は新規作成する
            console.log(`${dir}ディレクトリが存在しません。`);
            console.log("まずは指定されたディレクトリを新規作成します。");
            // ディレクトリの新規作成
            console.log("作成中...");

            return fs.promises
              .mkdir(dir, { recursive: true })
              .then(() => {
                console.log(`${dir}ディレクトリを新規作成しました。`);
                return {
                  message: "ディレクトリ作成に成功しました。",
                };
              })
              .catch((mkdirError) => {
                const errorInfo = {
                  source: "createDir",
                  name: mkdirError.name,
                  message: "ディレクトリの新規作成に失敗しました。",
                  errorMessage: mkdirError.message,
                  actionGuide: "エラーの詳細を確認してください。",
                };
                console.error(new Error(errorInfo.name));
                throw errorInfo;
              });
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
        })
    );
  },

  // 拡張子チェックと追加
  addExt: ({ fileName, fileExt }) => {
    console.log("拡張子チェックを行います");

    // 入力値の検証
    if (!fileName || !fileExt) {
      const error = {
        source: "addExt",
        name: "InvalidInputError",
        message: "ファイル名または拡張子が未指定、もしくは無効です。",
        actionGuide: "入力したファイル名と拡張子を確認してください。",
      };

      console.error(new Error(error.name));
      throw error;
    }

    try {
      // 入力時の拡張子の取得
      const currentExt = path.extname(fileName);
      // 目的の拡張子の取得
      const targetExt = `.${fileExt}`;

      // 拡張子が存在する場合
      if (currentExt === targetExt) {
        // そのまま返す

        return Promise.resolve({
          message: "拡張子は既に指定されています。このまま処理を続けます。",
          fileName: fileName,
          fileExt: fileExt,
        });
      }
      // 拡張子が存在しない場合
      else {
        console.log(`.${fileExt}拡張子が指定されていません。`);
        console.log(`.${fileExt}拡張子を追加します。`);

        const addExtFileName = `${fileName}${targetExt}`; // 拡張子を追加

        return Promise.resolve({
          message: "拡張子の追加に成功しました。",
          originalFileName: fileName,
          fileName: addExtFileName,
          fileExt: fileExt,
        });
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
  createPath: ({ dir = argv.dir, fileName } = {}) => {
      // ファイルの保存先のパスを作成する
      console.log("パスの生成を行います。");
      try {
        // パスの結合
        const pathResult = path.join(dir, fileName);

        return Promise.resolve({
          message: "パスの生成に成功しました。",
          path: pathResult,
        });
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
    ;
  },

  // ファイルの作成
  createFile: ({ path, fileName, dir = argv.dir, fileContent } = {}) => {
    console.log("ファイルの生成処理を行います。");
      // ファイルの存在チェック
      return fs.promises
        .access(path)
        .then(() => {
          // ファイルが存在する場合
          return {
            message: `${fileName}は既に${dir}内に保存されています。このまま処理を終了します。`,
            fileContent: fileContent,
          };
        })
        .catch((error) => {
          if (error.code === "ENOENT") {
            // ファイルが存在しない場合
            console.log(
              `${fileName}が存在しない為、${dir}内に新規作成します。`
            );
            console.log("ファイル生成中...");

            // ファイルの生成
            return fs.promises
              .writeFile(path, fileContent, {
                encoding: "utf-8",
              })
              .then(() => {

                return {
                  message: `${fileName}を${dir}に保存しました。`,
                  fileContent: `${fileContent.slice(0, 50)}...`, // 先頭50文字を表示
                };
              })
              .catch((writeFileError) => {
                const errorInfo = {
                  source: "createFile",
                  name: writeFileError.name,
                  message: "ファイルの生成に失敗しました。",
                  errorMessage: writeFileError.message,
                  actionGuide: "エラーの詳細を確認してください。",
                };
                console.error(new Error(errorInfo.name));
                throw errorInfo;
              });
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
        });
    ;
  },
};

// HTMLのファイル生成
const createHtml = Object.assign({}, createFs, {
  // プロパティの定義
  htmlName: argv.html, // HTMLファイル名
  htmlExt: "html", // HTMLファイルの拡張子
  htmlContent: argv.htmlContent, // HTMLファイルの内容

  // HTMLのパスを生成する
  create: function ({
    fileName = this.htmlName,
    fileExt = this.htmlExt,
    fileContent = this.htmlContent,
  } = {}) {
    return (
      // 拡張子チェックと追加
      this.addExt({ fileName, fileExt })
        // パスの生成
        .createPath()
        // ファイルの生成
        .createFile({
          fileContent: fileContent,
        })
        // メソッドチェーンの結果オブジェクトの取得
        .getResult()
    );
  },
  // CSSファイルをHTMLファイルに読み込む
  loadCssFileSync: function (htmlPath, htmlFileName, cssFileName) {
    try {
      // HTMLファイルの読み込み
      console.log(`まず${htmlFileName}を読み込み中...`);
      const readHtmlContent = fs.readFileSync(htmlPath, {
        encoding: "utf-8",
      });
      console.log(`${htmlFileName}の読み込み完了。`);

      // CSSファイルの読み込み
      // HTMLの書き換え

      console.log(
        `続いて${htmlFileName}内に${cssFileName}の相対パスを差し込みます。`
      );
      const updatedHtmlContent = readHtmlContent.replace(
        "</head>",
        `  <link rel="stylesheet" href="./${cssFileName}">\n</head>`
      );
      console.log(`${htmlFileName}の書き換え完了。`);

      // HTMLファイルの上書き保存
      console.log(`書き換えた内容を${htmlFileName}を保存します。`);
      console.log("保存中...");
      // HTMLファイルの上書き保存
      fs.writeFileSync(htmlPath, updatedHtmlContent, {
        encoding: "utf-8",
      });
      console.log(`${htmlFileName}の保存完了。`);
      console.log(`CSSファイルをHTMLファイルに読み込みました。`);

      return {
        success: true,
        htmlFileName: htmlFileName,
        htmlPath: htmlPath,
        cssFileName: cssFileName,
        beforeContent: readHtmlContent,
        updatedContent: updatedHtmlContent,
      };
    } catch (error) {
      console.error(
        `CSSファイルをHTMLファイルに読み込む処理中にエラーが発生しました。`
      );
      console.error(`処理を中断します。`);
      return {
        success: false,
        name: error.name,
        message: error.message,
      };
    }
  },
});

// CSSのファイル生成
const createCss = Object.assign({}, createFs, {
  // プロパティの定義
  cssName: argv.css, // CSSファイル名
  cssExt: "css", // CSSファイルの拡張子
  cssContent: argv.cssContent, // CSSファイルの内容

  // CSSのパスを生成する
  create: function ({
    fileName = this.cssName,
    fileExt = this.cssExt,
    fileContent = this.cssContent,
  } = {}) {
    return (
      // 拡張子チェックと追加
      this.addExt(fileName, fileExt)
        //パスの生成
        .createPath()
        // ファイルの生成
        .createFile({
          fileContent: fileContent,
        })
        // メソッドチェーンの結果オブジェクトの取得
        .getResult()
    );
  },
});

module.exports = {
  createFs,
  createHtml,
  createCss,
};
