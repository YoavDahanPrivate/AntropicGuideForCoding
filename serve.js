#!/usr/bin/env node
// Serves the presentation on http://localhost:PORT and opens it in the default browser.
// No dependencies. Usage: node serve.js [port] [--no-open]   (or: npm start)
const http = require("http");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const root = __dirname;
const args = process.argv.slice(2);
const port = Number(args.find((a) => /^\d+$/.test(a)) || process.env.PORT || 8080);
const noOpen = args.includes("--no-open") || process.env.NO_OPEN;
const types = { ".html": "text/html; charset=utf-8", ".md": "text/markdown; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".svg": "image/svg+xml" };

http.createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split("?")[0]);
  const file = path.normalize(path.join(root, urlPath === "/" ? "index.html" : urlPath));
  if (!file.startsWith(root + path.sep)) { res.writeHead(403); return res.end("Forbidden"); }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); return res.end("Not found"); }
    res.writeHead(200, { "Content-Type": types[path.extname(file)] || "application/octet-stream" });
    res.end(data);
  });
}).listen(port, "127.0.0.1", () => {
  const url = `http://localhost:${port}/`;
  console.log(`Presentation running at ${url}  (Ctrl+C to stop)`);
  console.log("Keys: arrows move, N notes, F full screen");
  if (noOpen) return;
  const cmd = process.platform === "win32" ? `start "" "${url}"` : process.platform === "darwin" ? `open "${url}"` : `xdg-open "${url}"`;
  exec(cmd, () => {});
}).on("error", (e) => {
  console.error(e.code === "EADDRINUSE" ? `Port ${port} is busy. Try: node serve.js ${port + 1}` : e.message);
  process.exit(1);
});
