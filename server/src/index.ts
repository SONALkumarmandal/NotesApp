import { createApp } from "./app";
import { config } from "./config/app.config";
import { prisma } from "./database/prisma";
const app=createApp()

async function start() {
  try {
    // Optionally test DB connection at startup
    await prisma.$connect();
    console.log("🟢 Prisma connected to DB");

    app.listen(config.port, () => {
      console.log(`Server listening on http://localhost:${config.port}`);
    });
  } catch (err) {
    console.error("Startup error:", err);
    process.exit(1);
  }
}

start();