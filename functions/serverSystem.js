const express = require("express");
const argv = require("../option.js");
const handleErrorSystem = require("./handleErrorSystem.js");
const { setResult } = require("./FileSystem.js");
const path = require("node:path");

const serverSystem = {
  server: express(),
  PORT: 3000,

  // 開発用：ログ出力の設定
  setDevLog: () => {
    const { server } = serverSystem;

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
  },

  // レスポンス内容の設定メソッド
  setResponseFile: ({
    fileDir,
    htmlFileName,
  } = {}) => {
    const { server } = serverSystem;

    // htmlファイルがデフォルト以外の場合
    if (htmlFileName !== "index.html") {
      // ルートパスにアクセスした場合、作成したHTMLファイルを返す
      server.get("/", (req, res) => {
        // ルートディレクトリからのパスの結合
        const resolvePath = path.resolve(process.cwd(), fileDir, htmlFileName);
        res.sendFile(resolvePath);
      });
    } else {
      // デフォルト時：静的ファイル配信
      const staticDir = server.use(express.static(fileDir));
    }
  },

  // サーバーの起動メソッド
  startServer: async ({ fileDir = argv.dir, htmlFileName = "index.html" }) => {
    const { server } = serverSystem;

    try {
      // サーバーのログ出力設定
      serverSystem.setDevLog();
      // レスポンス内容の設定
      serverSystem.setResponseFile({
        fileDir: fileDir,
        htmlFileName: htmlFileName,
      });

      // サーバーの起動
      const listen = server.listen(serverSystem.PORT, () => {
        console.log(`サーバーがポート${serverSystem.PORT}で起動しました。`);
      });

      return setResult({
        message: `静的ファイルの配信に成功しました。`,
        fileDir: fileDir,
        htmlFileName: htmlFileName,
        port: serverSystem.PORT,
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
