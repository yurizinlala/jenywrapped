import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
const root = path.resolve("out");
const basePath = (process.env.BASE_PATH ?? "").replace(/\/$/, "");
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon",
  ".json": "application/json",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
  ".ogg": "audio/ogg",
  ".m4a": "audio/mp4",
};
http
  .createServer(async (req, res) => {
    try {
      const url = new URL(req.url, "http://localhost");
      const pathname = decodeURIComponent(url.pathname);
      if (
        basePath &&
        pathname !== basePath &&
        !pathname.startsWith(basePath + "/")
      ) {
        res.writeHead(404);
        res.end();
        return;
      }
      let relative = pathname.slice(basePath.length).replace(/^\/+/, "");
      if (!relative) relative = "index.html";
      let target = path.resolve(root, relative);
      if (!target.startsWith(root + path.sep)) {
        res.writeHead(403);
        res.end();
        return;
      }
      try {
        if ((await stat(target)).isDirectory())
          target = path.join(target, "index.html");
      } catch {
        if (!path.extname(target)) target += ".html";
      }
      const body = await readFile(target);
      res.writeHead(200, {
        "Content-Type":
          types[path.extname(target)] ?? "application/octet-stream",
      });
      res.end(body);
    } catch {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Página não encontrada. Execute pnpm build antes de pnpm start.");
    }
  })
  .listen(Number(process.env.PORT ?? 3000), "0.0.0.0", () =>
    console.log("Jeny Wrapped: http://localhost:" + (process.env.PORT ?? 3000)),
  );
