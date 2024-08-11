import { container } from "../../../../../core/container";

import type { CommonModule, AccountModule, Core } from "@types";

import type {
  AccountController,
  SubscriptionController,
} from "../../../controllers";

const ENDPOINT_SCOPE_TYPE = "user";

export const userResolvers: Core.Service.MercuriusResolvers = {
  Query: {
    // ----------------------------------------------------------------
    // Account
    readAccount: async (
      _source: {},
      args: CommonModule.Payload.Controller.Read.Input["payload"],
      context,
      info,
    ) => {
      const accountController = container.get<AccountController>(
        "accountController",
        context.reply.request.requestId,
      );
      return await accountController.readAccount({
        requestType: info.fieldName,
        scopeType: ENDPOINT_SCOPE_TYPE,
        request: context.reply.request,
        reply: context.reply,
        payload: args,
      });
    },
    // ----------------------------------------------------------------
    // Subscription
    readSubscription: async (
      _source: {},
      args: CommonModule.Payload.Controller.Read.Input["payload"],
      context,
      info,
    ) => {
      const subscriptionController = container.get<SubscriptionController>(
        "subscriptionController",
        context.reply.request.requestId,
      );
      return await subscriptionController.readSubscription({
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
    // Account
    updateAccount: async (
      _source: {},
      args: AccountModule.Payload.Controller.UpdateAccount.Input["payload"],
      context,
      info,
    ) => {
      const accountController = container.get<AccountController>(
        "accountController",
        context.reply.request.requestId,
      );
      return await accountController.updateAccount({
        requestType: info.fieldName,
        scopeType: ENDPOINT_SCOPE_TYPE,
        request: context.reply.request,
        reply: context.reply,
        payload: args,
      });
    },
    removeAccount: async (
      _source: {},
      args: AccountModule.Payload.Controller.RemoveAccount.Input["payload"],
      context,
      info,
    ) => {
      const accountController = container.get<AccountController>(
        "accountController",
        context.reply.request.requestId,
      );
      return await accountController.removeAccount({
        requestType: info.fieldName,
        scopeType: ENDPOINT_SCOPE_TYPE,
        request: context.reply.request,
        reply: context.reply,
        payload: args,
      });
    },
  },
};
