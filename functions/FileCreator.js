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

// HTMLのファイル生成
const createHtml = Object.assign({}, FileSystem, {
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
const createCss = Object.assign({}, FileSystem, {
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
  FileCreator,
  createHtml,
  createCss,
};
