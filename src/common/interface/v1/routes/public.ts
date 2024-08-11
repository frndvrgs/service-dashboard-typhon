import { FastifyInstance } from "fastify";
import { settings } from "../../../../core/settings";

export const publicRoutes = async (apiInstance: FastifyInstance) => {
  apiInstance.get("/", (_request, reply) => {
    reply.send({
      service: settings.env.SERVICE_NAME,
      version: "1.0",
      path: `${settings.web.api.path}/v1`,
    });
  });
};
