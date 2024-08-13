import plugin from "fastify-plugin";

import { container } from "../../../container";

import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import type * as interfaceHandlers from "../../../../common/handlers";

const sessionHandler =
  container.get<interfaceHandlers.SessionHandler>("sessionHandler");
const statusHandler =
  container.get<interfaceHandlers.StatusHandler>("statusHandler");

export default plugin(async (fastify: FastifyInstance) => {
  fastify.addHook(
    "onRequest",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const path = request.routeOptions.url;

      if (!path) return;

      switch (true) {
        case path === "/":
        case path.startsWith("/session"):
        case path.startsWith("/ws"):
          return;

        case path.startsWith("/user"):
          await authorizeRequest(request, reply, ["user"]);
          break;

        case path.startsWith("/service"):
          await authorizeRequest(request, reply, ["service"]);
          break;

        default:
          return;
      }
    },
  );

  async function authorizeRequest(
    request: FastifyRequest,
    reply: FastifyReply,
    requestScope: string[],
  ) {
    try {
      await sessionHandler.authorize(request, requestScope);
    } catch (error) {
      reply.code(401).send({
        status: statusHandler.createHttpStatus({
          description: "NOT_AUTHENTICATED",
          code: 401,
          context: "INTERFACE",
          scope: "authorization request hook.",
        }),
      });
    }
  }
});
