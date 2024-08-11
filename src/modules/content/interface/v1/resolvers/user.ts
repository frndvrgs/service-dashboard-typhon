import { container } from "../../../../../core/container";

import type { CommonModule, ContentModule, Core } from "@types";
import type {
  ProfileController,
  FeatureController,
} from "../../../controllers";

const ENDPOINT_SCOPE_TYPE = "user";

export const userResolvers: Core.Service.MercuriusResolvers = {
  Query: {
    // ----------------------------------------------------------------
    // Profile
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
    // ----------------------------------------------------------------
    // Feature
    listFeatures: async (
      _source: {},
      args: CommonModule.Payload.Controller.List.Input["payload"],
      context,
      info,
    ) => {
      const featureController = container.get<FeatureController>(
        "featureController",
        context.reply.request.requestId,
      );
      return await featureController.listFeatures({
        requestType: info.fieldName,
        scopeType: ENDPOINT_SCOPE_TYPE,
        request: context.reply.request,
        reply: context.reply,
        payload: args,
      });
    },
  },
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
  },
};
