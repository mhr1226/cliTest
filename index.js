const {
  createFs,
  createHtml,
  createCss,
} = require("./functions/CreateFileSystem.js");

const argv = require("./option.js");

createFs
  .checkFileName(argv.html)
  .then((fileResult) => {
    console.log("ファイル名結果：", fileResult);
    return createFs.checkDir().then((dirResult) => ({
      ...fileResult,
      ...dirResult,
    }));
  })
  .then((firstMergeResult) => {
    console.log("結果", firstMergeResult);
    return createFs.createDir(argv.dir).then((dirCreateResult) => ({
      ...firstMergeResult,
      ...dirCreateResult,
    }));
  })
  .then((secondMergeResult) => {
    console.log("結果：", secondMergeResult);
    return createFs
      .addExt({
        fileName: secondMergeResult.fileName,
        fileExt: "html",
      })
      .then((addExtResult) => ({
        ...secondMergeResult,
        ...addExtResult,
      }));
  })
  .then((thirdMergeResult) => {
    console.log("結果：", thirdMergeResult);
    return createFs
      .createPath({
        fileName: thirdMergeResult.fileName,
      })
      .then((pathResult) => ({
        ...thirdMergeResult,
        ...pathResult,
      }));
  })
  .then((fourthMergeResult) => {
    console.log("結果：", fourthMergeResult);
    return createFs
      .createFile({
        path: fourthMergeResult.path,
        fileName: fourthMergeResult.fileName,
        fileContent: argv.htmlContent,
      })
      .then((createFileResult) => ({ 
        ...fourthMergeResult,
        ...createFileResult,
      }));
  })
  .then((fifthMergeResult) => {
    console.log("結果：", fifthMergeResult);
    console.log("全ての処理が完了したので、終了します。");
    return;
  })
  .catch((error) => {
    // 不明なエラー発生時の処理
    if (!error.source || error.source === undefined) {
      // エラーの発生場所
      const secondStack = error.stack.split("\n")[1];
      console.error(`${secondStack}でエラーが発生しています。`);
      console.error("エラーの詳細を確認してください。");
      console.error("エラー詳細：", error);
      console.error("処理を終了します。");
    } else {
      // 通常のエラー発生時の処理
      console.error(`${error.source}でエラーが発生しています。`);
      console.error("エラー詳細：", error);
      console.error("処理を終了します。");
    }
  });