import "./core/container";

import { settings } from "./core/settings";
import { logger } from "./common/helpers/logger";

import { webServer } from "./core/services/web-server";
import { databaseClient } from "./core/services/database";

/**
 * service-dashboard-typhon
 * @author frndvrgs <contact@frndvrgs.com>
 *
 */

class Application {
  async start() {
    try {
      logger.info(`:: ${settings.server.name}`);
      await databaseClient.verify();
      await webServer.start();
    } catch (err) {
      logger.error(`:: error starting the application.`, err);
      process.exit(1);
    }
  }

  async stop() {
    try {
      await databaseClient.stop();
      await webServer.stop();
      process.exit(0);
    } catch (err) {
      logger.error(`:: error stopping the application.`, err);
      process.exit(1);
    }
  }
}

const run = async () => {
  const application = new Application();

  await application.start();

  process.on("SIGTERM", async () => {
    await application.stop();
  });

  process.on("SIGINT", async () => {
    await application.stop();
  });
};

process.stdout.setEncoding("utf8");

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});

run();
