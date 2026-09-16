import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { createApiRouter } from "./api";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.use(express.json());

  // Mount official Contest REST API
  app.use("/api", createApiRouter());

  // Serve static files from dist/public in production
  const possiblePaths = [
    path.resolve(__dirname, "public"),
    path.resolve(__dirname, "..", "dist", "public"),
    path.resolve(process.cwd(), "dist", "public"),
    path.resolve(process.cwd(), "public"),
  ];
  const staticPath = possiblePaths.find((p) => fs.existsSync(p)) || possiblePaths[0];

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    const indexPath = path.join(staticPath, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send("Frontend build not found. Please run npm run build.");
    }
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Pragati University Engineering Olympics Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);

