import { container } from "../../../../../core/container";

import type { ContentModule, Core } from "@types";
import type {
  ProfileController,
  FeatureController,
} from "../../../controllers";

const ENDPOINT_SCOPE_TYPE = "service";

export const serviceResolvers: Core.Service.MercuriusResolvers = {
  Mutation: {
    // ----------------------------------------------------------------
    // Profile
    createProfile: async (
      _source: {},
      args: ContentModule.Payload.Controller.CreateProfile.Input["payload"],
      context,
      info,
    ) => {
      const profileController = container.get<ProfileController>(
        "profileController",
        context.reply.request.requestId,
      );
      return await profileController.createProfile({
        requestType: info.fieldName,
        scopeType: ENDPOINT_SCOPE_TYPE,
        request: context.reply.request,
        reply: context.reply,
        payload: args,
      });
    },
    updateProfile: async (
      _source: {},
      args: ContentModule.Payload.Controller.UpdateProfile.Input["payload"],
      context,
      info,
    ) => {
      const profileController = container.get<ProfileController>(
        "profileController",
        context.reply.request.requestId,
      );
      return await profileController.updateProfile({
        requestType: info.fieldName,
        scopeType: ENDPOINT_SCOPE_TYPE,
        request: context.reply.request,
        reply: context.reply,
        payload: args,
      });
    },
    removeProfile: async (
      _source: {},
      args: ContentModule.Payload.Controller.RemoveProfile.Input["payload"],
      context,
      info,
    ) => {
      const profileController = container.get<ProfileController>(
        "profileController",
        context.reply.request.requestId,
      );
      return await profileController.removeProfile({
        requestType: info.fieldName,
        scopeType: ENDPOINT_SCOPE_TYPE,
        request: context.reply.request,
        reply: context.reply,
        payload: args,
      });
    },
    // ----------------------------------------------------------------
    // Feature
    createFeature: async (
      _source: {},
      args: ContentModule.Payload.Controller.CreateFeature.Input["payload"],
      context,
      info,
    ) => {
      const featureController = container.get<FeatureController>(
        "featureController",
        context.reply.request.requestId,
      );
      return await featureController.createFeature({
        requestType: info.fieldName,
        scopeType: ENDPOINT_SCOPE_TYPE,
        request: context.reply.request,
        reply: context.reply,
        payload: args,
      });
    },
    updateFeature: async (
      _source: {},
      args: ContentModule.Payload.Controller.UpdateFeature.Input["payload"],
      context,
      info,
    ) => {
      const featureController = container.get<FeatureController>(
        "featureController",
        context.reply.request.requestId,
      );
      return await featureController.updateFeature({
        requestType: info.fieldName,
        scopeType: ENDPOINT_SCOPE_TYPE,
        request: context.reply.request,
        reply: context.reply,
        payload: args,
      });
    },
    removeFeature: async (
      _source: {},
      args: ContentModule.Payload.Controller.RemoveFeature.Input["payload"],
      context,
      info,
    ) => {
      const featureController = container.get<FeatureController>(
        "featureController",
        context.reply.request.requestId,
      );
      return await featureController.removeFeature({
        requestType: info.fieldName,
        scopeType: ENDPOINT_SCOPE_TYPE,
        request: context.reply.request,
        reply: context.reply,
        payload: args,
      });
    },
  },
};
