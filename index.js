const {
  createFs,
  createHtml,
  createCss,
} = require("./functions/CreateFileSystem.js");

const argv = require("./option.js");

const checkFileParameters = async (fileName) => {
  const [fileResult, dirResult] = await Promise.all([
    createFs.checkFileName(fileName),
    createFs.checkDir(),
  ]);

  console.log("ファイル名結果：", fileResult);
  console.log("ディレクトリ結果：", dirResult);

  const extResult = await createFs.checkExt(fileResult.name);
  console.log("拡張子結果：", extResult);
  const result = { fileResult, dirResult, extResult };
  return result;
};

const addExtAndCreatePath = async () => {
  // ファイル名、ディレクトリ、拡張子の確認
  const checkResult = await checkFileParameters(argv.html);
  const { fileResult, extResult } = checkResult;

  // 拡張子を追加
  const addExtResult = await createFs.addExt({
    fileName: fileResult.name,
    fileExt: extResult.name,
    targetExtension: "html",
  });

  console.log("拡張子追加結果：", addExtResult);

  // パスを作成
  const createPathResult = await createFs.createPath({
    fileName: addExtResult.fileName,
  });

  console.log("パス作成結果：", createPathResult);

  const result = {
    ...checkResult,
    addExtResult,
    createPathResult,
  };
  console.log("結果:", result);
  return result;
};

addExtAndCreatePath();

// createFs
//   .checkFileName(argv.html)
//   .then((result) => {
//     console.log("ファイル名結果：", result);
//     return createFs.checkDir().then((dirResult) => ({
//       ...result,
//       ...dirResult,
//     }));
//   })
//   .then((result) => {
//     console.log("結果", result);
//     return createFs.createDir(argv.dir).then((dirCreateResult) => ({
//       ...result,
//       ...dirCreateResult,
//     }));
//   })
//   .then((result) => {
//     console.log("結果：", result);
//     return createFs
//       .addExt({
//         fileName: result.fileName,
//         fileExt: "html",
//       })
//       .then((addExtResult) => ({
//         ...result,
//         ...addExtResult,
//       }));
//   })
//   .then((result) => {
//     console.log("結果：", result);
//     return createFs
//       .createPath({
//         fileName: result.fileName,
//       })
//       .then((pathResult) => ({
//         ...result,
//         ...pathResult,
//       }));
//   })
//   .then((result) => {
//     console.log("結果：", result);
//     return createFs
//       .createFile({
//         path: result.path,
//         fileName: result.fileName,
//         fileContent: argv.htmlContent,
//       })
//       .then((createFileResult) => ({
//         ...result,
//         ...createFileResult,
//       }));
//   })
//   .then((result) => {
//     console.log("結果：", result);
//     console.log("全ての処理が完了したので、終了します。");
//     return;
//   })
//   .catch((error) => {
//     // 不明なエラー発生時の処理
//     if (!error.source || error.source === undefined) {
//       // エラーの発生場所
//       const secondStack = error.stack.split("\n")[1];
//       console.error(`${secondStack}でエラーが発生しています。`);
//       console.error("エラーの詳細を確認してください。");
//       console.error("エラー詳細：", error);
//       console.error("処理を終了します。");
//     } else {
//       // 通常のエラー発生時の処理
//       console.error(`${error.source}でエラーが発生しています。`);
//       console.error("エラー詳細：", error);
//       console.error("処理を終了します。");
//     }
//   });
