import { spawn } from "node:child_process";
import { resolve } from "node:path";

const root = process.cwd();
const serverDir = resolve(root, "server");
const clientDir = resolve(root, "client");

console.log("\n  Tutorin Dev Server\n");

// Jalankan Express Backend (Node)
const server = spawn(
  process.execPath,
  ["--watch", "--env-file=.env", "src/index.js"],
  {
    cwd: serverDir,
    stdio: ["inherit", "pipe", "inherit"],
  }
);

// Jalankan Vite Frontend
const client = spawn(
  process.execPath,
  [resolve(clientDir, "node_modules/vite/bin/vite.js"), "--clearScreen", "false"],
  {
    cwd: clientDir,
    stdio: ["inherit", "pipe", "inherit"],
  }
);

server.stdout.on("data", (data) => {
  const text = data.toString().trim();
  if (text.includes("Tutorin API berjalan")) {
    console.log("  > Backend API : http://localhost:4000");
  } else if (text && !text.includes("Restarting")) {
    console.log(`[server] ${text}`);
  }
});

client.stdout.on("data", (data) => {
  const text = data.toString().trim();
  if (text.includes("Local:")) {
    console.log("  > Frontend    : http://localhost:5173\n");
  } else if (
    text &&
    !text.includes("ready in") &&
    !text.includes("Network:") &&
    !text.includes("VITE v")
  ) {
    console.log(`[client] ${text}`);
  }
});

const cleanup = () => {
  server.kill();
  client.kill();
  process.exit(0);
};

process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);
