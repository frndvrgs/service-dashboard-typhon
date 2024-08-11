import { container } from "../../../../../core/container";

import type { CommonModule, ProductModule, Core } from "@types";
import type { WorkController } from "../../../controllers";

const ENDPOINT_SCOPE_TYPE = "service";

export const serviceResolvers: Core.Service.MercuriusResolvers = {
  Query: {
    listWorks: async (
      _source: {},
      args: CommonModule.Payload.Controller.List.Input["payload"],
      context,
      info,
    ) => {
      const workController = container.get<WorkController>(
        "workController",
        context.reply.request.requestId,
      );
      return await workController.listWorks({
        requestType: info.fieldName,
        scopeType: ENDPOINT_SCOPE_TYPE,
        request: context.reply.request,
        reply: context.reply,
        payload: args,
      });
    },
  },
  Mutation: {
    createWork: async (
      _source: {},
      args: ProductModule.Payload.Controller.CreateWork.Input["payload"],
      context,
      info,
    ) => {
      const workController = container.get<WorkController>(
        "workController",
        context.reply.request.requestId,
      );
      return await workController.createWork({
        requestType: info.fieldName,
        scopeType: ENDPOINT_SCOPE_TYPE,
        request: context.reply.request,
        reply: context.reply,
        payload: args,
      });
    },
    updateWork: async (
      _source: {},
      args: ProductModule.Payload.Controller.UpdateWork.Input["payload"],
      context,
      info,
    ) => {
      const workController = container.get<WorkController>(
        "workController",
        context.reply.request.requestId,
      );
      return await workController.updateWork({
        requestType: info.fieldName,
        scopeType: ENDPOINT_SCOPE_TYPE,
        request: context.reply.request,
        reply: context.reply,
        payload: args,
      });
    },
    removeWork: async (
      _source: {},
      args: ProductModule.Payload.Controller.RemoveWork.Input["payload"],
      context,
      info,
    ) => {
      const workController = container.get<WorkController>(
        "workController",
        context.reply.request.requestId,
      );
      return await workController.removeWork({
        requestType: info.fieldName,
        scopeType: ENDPOINT_SCOPE_TYPE,
        request: context.reply.request,
        reply: context.reply,
        payload: args,
      });
    },
  },
};
