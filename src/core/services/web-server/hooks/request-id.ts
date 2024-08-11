import plugin from "fastify-plugin";

import { settings } from "../../../../core/settings";
import { container } from "../../../container";

import type { FastifyInstance } from "fastify";

declare module "fastify" {
  interface FastifyRequest {
    requestId: symbol;
  }
}

export default plugin(async (fastify: FastifyInstance) => {
  fastify.addHook("onRequest", (request, _reply, done) => {
    request.requestId = Symbol("requestId");
    done();
  });

  fastify.addHook("onResponse", (request, _reply, done) => {
    if (settings.web.useRequestScope) {
      container.cleanupRequest(request.requestId);
    }
    done();
  });
});
