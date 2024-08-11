import plugin from "fastify-plugin";
import { settings } from "../../../core/settings";
import authorizationHook from "./hooks/authorization";

import { publicRoutes } from "../../../common/interface/v1/routes";
import * as accountRoutes from "../../../modules/account/interface/v1/routes";

import type { FastifyInstance } from "fastify";

export default plugin(async (fastify: FastifyInstance) => {
  fastify.register(authorizationHook);

  fastify.register(
    async (apiInstance) => {
      await publicRoutes(apiInstance);

      apiInstance.register(
        async (userInstance) => {
          await userInstance.register(accountRoutes.userRoutes);
        },
        { prefix: "/user" },
      );

      apiInstance.register(
        async (serviceInstance) => {
          await serviceInstance.register(accountRoutes.serviceRoutes);
        },
        { prefix: "/service" },
      );
    },
    { prefix: `${settings.web.api.path}/v1` },
  );

  fastify.setNotFoundHandler((_request, reply) => {
    reply.send({ message: "endpoint not found" });
  });
});
