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

class App {
  async start() {
    try {
      logger.info(`:: ${settings.server.name}`);
      await databaseClient.verify();
      await webServer.start();
    } catch (err) {
      logger.error(`:: error starting the application.`);
      process.exit(1);
    }
  }

  async stop() {
    try {
      await databaseClient.stop();
      await webServer.stop();
      process.exit(0);
    } catch (err) {
      logger.error(`:: error stopping the applcation.`);
      process.exit(1);
    }
  }
}

const app = new App();

process.stdout.setEncoding("utf8");

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
  app.stop();
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  app.stop();
});

process.on("SIGINT", () => {
  app.stop();
});

process.on("SIGTERM", () => {
  app.stop();
});

app.start();
