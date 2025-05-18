const FileCreator = require("./functions/FileCreator.js");
const HtmlCreator = require("./functions/HtmlCreator.js");
const CssCreator = require("./functions/CssCreator.js");

const argv = require("./option.js");

const test = async () => {
  try {
    console.log("testを実行します。");

    // ファイル名の確認
    const fileResult = await FileCreator.checkFileName(argv.html);
    console.log(fileResult);

    // ディレクトリの確認
    const dirResult = await FileCreator.checkDir();
    console.log(dirResult);

    // 拡張子の確認
    const extResult = await FileCreator.checkExt(argv.html);
    console.log(extResult);
    // 拡張子の追加
    const addExtResult = await FileCreator.addExt({
      fileName: argv.html,
      fileExt: extResult.name,
      targetExtension: "html",
    });
    console.log(addExtResult);
    // パスの作成
    const createPathResult = await FileCreator.createPath({
      fileName: addExtResult.fileName,
    });
    console.log(createPathResult);

    // ディレクトリの作成
    const createDirResult = await FileCreator.createDir();
    console.log(createDirResult);
    // ファイルの生成
    const createFileResult = await FileCreator.createFile({
      path: createPathResult.name,
      fileName: addExtResult.fileName,
      fileContent: argv.htmlContent
    });
    console.log(createFileResult);
  } catch (err) {
    // 関数の終点
    // エラー内容の出力
    FileCreator.setCatchErrorLogs(err);
  }
};

test();

// const main = async () => {
//   try {
//     // HTMLとCSSファイルを同時生成
//     const createHtmlAndCss = await Promise.all([
//       HtmlCreator.createHtml(),
//       CssCreator.createCss(),
//     ]);

//     const result = {
//       htmlName: createHtmlAndCss[0].htmlName,
//       htmlPath: createHtmlAndCss[0].htmlPath,
//       cssName: createHtmlAndCss[1].cssName,
//     };

//     // 作成したCSSファイルをHTMLファイルに読み込む
//     const loadCss = await HtmlCreator.loadCssToHtml({
//       htmlFileName: result.htmlName,
//       cssFileName: result.cssName,
//       path: result.htmlPath,
//     });

//     console.log("生成結果：", result);

//     return result;
//   } catch (err) {
//     // エラー情報をセット
//     console.log(`mainのエラー出力を確認します。`);
//     console.error(JSON.stringify(err));
//     throw FileCreator.setError(err);
//   }
// };

// main();
