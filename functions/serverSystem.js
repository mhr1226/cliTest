const express = require("express");
const argv = require("../option.js");
const handleErrorSystem = require("./handleErrorSystem.js");
const { setResult } = require("./FileSystem.js");
const path = require("node:path");

const serverSystem = {
  server: express(),
  // サーバーの起動
  // 引数には作成したディレクトリを指定
  startServer: async ({ fileDir = argv.dir, htmlFileName = "index.html" }) => {
    const { server } = serverSystem;

    try {
      // サーバーのリクエストログを出力
      server.use((req, res, next) => {
        console.log(`=== リクエスト詳細 ===`);
        console.log(`時刻: ${new Date().toLocaleTimeString()}`);
        console.log(`メソッド: ${req.method}`);
        console.log(`URL: ${req.url}`);
        console.log(`User-Agent: ${req.get("User-Agent")?.slice(0, 50)}...`);
        console.log(`===================`);
        next();
      });

      // htmlファイルがデフォルト以外の場合
      if (htmlFileName !== "index.html") {
        // ルートパスにアクセスした場合、作成したHTMLファイルを返す

        try {
          server.get("/", (req, res) => {
            // ルートディレクトリからのパスの結合
            const resolvePath = path.resolve(
              process.cwd(),
              fileDir,
              htmlFileName
            );
            res.sendFile(resolvePath);
          });
        } catch (err) {
          throw err;
        }
      }
      // 静的ファイル配信
      const staticDir = server.use(express.static(fileDir));

      // サーバーの起動
      const listen = server.listen(3000, () => {
        console.log("サーバーがポート3000で起動しました。");
      });

      return setResult({
        message: `静的ファイルの配信に成功しました。`,
        fileDir: fileDir,
        htmlFileName: htmlFileName,
      });
    } catch (err) {
      throw handleErrorSystem.setCustomErrorAll({
        source: "startServer",
        name: "StaticFileError",
        message: "静的ファイルの配信に失敗しました。",
        actionGuide: "ディレクトリのパスをが存在するか確認してください。",
      });
    }
  },
};

module.exports = serverSystem;
