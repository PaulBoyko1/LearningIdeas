import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)));
const port = Number(process.env.LEARNING_IDEAS_PORT ?? 4175);
const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8"
};
const publicFiles = new Set(["index.html", "app.mjs", "content.mjs", "styles.css"]);

function send(response, status, body, headers = {}) {
  response.writeHead(status, { "content-type": "text/plain; charset=utf-8", ...headers });
  response.end(body);
}

function safePath(rootDir, requested) {
  const file = path.resolve(rootDir, requested);
  const relative = path.relative(rootDir, file);
  if (!relative || relative === ".." || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
    return null;
  }
  return file;
}

export function createLearningIdeasServer(rootDir = root) {
  return createServer((request, response) => {
    response.setHeader("x-content-type-options", "nosniff");
    response.setHeader("referrer-policy", "no-referrer");
    response.setHeader("content-security-policy", "default-src 'self'; connect-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'");
    if (request.method !== "GET") {
      send(response, 405, "Method not allowed");
      return;
    }
    let requested;
    try {
      requested = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
    } catch {
      send(response, 400, "Invalid request path");
      return;
    }
    const relative = requested === "/" ? "index.html" : requested.slice(1);
    if (!publicFiles.has(relative)) {
      send(response, 404, "Not found");
      return;
    }
    const file = safePath(rootDir, relative);
    if (!file) {
      send(response, 403, "Forbidden");
      return;
    }
    if (!existsSync(file) || !statSync(file).isFile()) {
      send(response, 404, "Not found");
      return;
    }
    response.writeHead(200, {
      "content-type": contentTypes[path.extname(file)] ?? "application/octet-stream",
      "cache-control": "no-cache"
    });
    createReadStream(file).pipe(response);
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const server = createLearningIdeasServer();
  server.listen(port, "127.0.0.1", () => {
    console.log(`LearningIdeas is available at http://127.0.0.1:${port}`);
  });
}
