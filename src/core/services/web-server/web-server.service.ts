import fastify from "fastify";
import helmet from "@fastify/helmet";
import cors from "@fastify/cors";
import compress from "@fastify/compress";
import cookie from "@fastify/cookie";
import rateLimit from "@fastify/rate-limit";
import websocket from "@fastify/websocket";

import { settings } from "../../settings";
import { ServerException } from "../../../common/exceptions";
import { logger } from "../../../common/helpers/logger";

import routes from "./web-server.routes";
import graphql from "../graphql/graphql.service";

import hooks from "./hooks/request-id.hook";

import type { FastifyInstance } from "fastify";

class WebServer {
  private server: FastifyInstance;

  constructor() {
    this.server = fastify(settings.web.fastify);
  }

  public async start() {
    try {
      await this.server
        .register(helmet)
        .register(cors)
        .register(compress)
        .register(cookie, settings.web.cookie)
        .register(rateLimit, settings.web.rateLimit)
        .register(websocket)
        .register(routes)
        .register(graphql)
        .register(hooks);

      await this.server.listen({
        host: settings.web.host,
        port: settings.web.port,
        listenTextResolver: (address) => `web server listening at ${address}`,
      });
      logger.info(":: web server started.");
    } catch (err) {
      throw new ServerException(
        "WEB_SERVER_ERROR",
        500,
        "web server internal error.",
        "WebServer server.listen()",
        err,
      );
    }
  }

  public async stop() {
    try {
      await this.server.close();
      logger.info(":: web server stopped.");
    } catch (err) {
      throw new ServerException(
        "WEB_SERVER_ERROR",
        500,
        "web server internal error.",
        "WebServer server.close()",
        err,
      );
    }
  }

  public getInstance() {
    return this.server;
  }
}

export const webServer = new WebServer();
