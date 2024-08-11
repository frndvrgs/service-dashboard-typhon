import { FastifyInstance } from "fastify";
import { container } from "../../../../../core/container";

import type { SessionController } from "../../../controllers";
import type { AccountModule } from "@types";

export const userRoutes = async (userInstance: FastifyInstance) => {
  userInstance.post("/session/create", async (request, reply) => {
    const sessionController = container.get<SessionController>(
      "sessionController",
      request.requestId,
    );
    return await sessionController.createSession({
      requestType: "createSession",
      scopeType: "user",
      request,
      reply,
      payload: {
        body: request.body,
      } as AccountModule.Payload.Controller.CreateSession.Input["payload"],
    });
  });

  userInstance.delete("/session/remove", async (request, reply) => {
    const sessionController = container.get<SessionController>(
      "sessionController",
      request.requestId,
    );
    return await sessionController.removeSession({
      requestType: "removeSession",
      scopeType: "user",
      request,
      reply,
    });
  });
};
