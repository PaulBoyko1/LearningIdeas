import assert from "node:assert/strict";
import test from "node:test";

import { createLearningIdeasServer } from "../server.mjs";

async function startServer() {
  const server = createLearningIdeasServer();
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const { port } = server.address();
  return {
    origin: `http://127.0.0.1:${port}`,
    close: () => new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()))
  };
}

test("LearningIdeas serves only its public learning assets with a restrictive policy", async () => {
  const instance = await startServer();
  try {
    const home = await fetch(`${instance.origin}/`);
    assert.equal(home.status, 200);
    assert.match(await home.text(), /LearningIdeas/);
    assert.match(home.headers.get("content-security-policy"), /frame-ancestors 'none'/);

    const module = await fetch(`${instance.origin}/content.mjs`);
    assert.equal(module.status, 200);
    assert.match(module.headers.get("content-type"), /text\/javascript/);

    assert.equal((await fetch(`${instance.origin}/package.json`)).status, 404);
    assert.equal((await fetch(`${instance.origin}/..%2Fpackage.json`)).status, 404);
    assert.equal((await fetch(`${instance.origin}/`, { method: "POST" })).status, 405);
  } finally {
    await instance.close();
  }
});
