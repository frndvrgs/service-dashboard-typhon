import { container } from "../../../../../core/container";

import type { CommonModule, Core } from "@types";
import type { ProfileController } from "../../../controllers";

const ENDPOINT_SCOPE_TYPE = "public";

export const publicResolvers: Core.Service.MercuriusResolvers = {
  Query: {
    // ----------------------------------------------------------------
    // Profile
    listProfiles: async (
      _source: {},
      args: CommonModule.Payload.Controller.List.Input["payload"],
      context,
      info,
    ) => {
      const profileController = container.get<ProfileController>(
        "profileController",
        context.reply.request.requestId,
      );
      return await profileController.listProfiles({
        requestType: info.fieldName,
        scopeType: ENDPOINT_SCOPE_TYPE,
        request: context.reply.request,
        reply: context.reply,
        payload: args,
      });
    },
    readProfile: async (
      _source: {},
      args: CommonModule.Payload.Controller.Read.Input["payload"],
      context,
      info,
    ) => {
      const profileController = container.get<ProfileController>(
        "profileController",
        context.reply.request.requestId,
      );
      return await profileController.readProfile({
        requestType: info.fieldName,
        scopeType: ENDPOINT_SCOPE_TYPE,
        request: context.reply.request,
        reply: context.reply,
        payload: args,
      });
    },
  },
};
