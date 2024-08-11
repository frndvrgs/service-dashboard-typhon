import { container } from "../../../../../core/container";

import type { CommonModule, AccountModule, Core } from "@types";

import type {
  AccountController,
  SubscriptionController,
} from "../../../controllers";

const ENDPOINT_SCOPE_TYPE = "service";

export const serviceResolvers: Core.Service.MercuriusResolvers = {
  Query: {
    // ----------------------------------------------------------------
    // Account
    listAccounts: async (
      _source: {},
      args: CommonModule.Payload.Controller.List.Input["payload"],
      context,
      info,
    ) => {
      const accountController = container.get<AccountController>(
        "accountController",
        context.reply.request.requestId,
      );
      return await accountController.listAccounts({
        requestType: info.fieldName,
        scopeType: ENDPOINT_SCOPE_TYPE,
        request: context.reply.request,
        reply: context.reply,
        payload: args,
      });
    },
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
    listSubscriptions: async (
      _source: {},
      args: CommonModule.Payload.Controller.List.Input["payload"],
      context,
      info,
    ) => {
      const subscriptionController = container.get<SubscriptionController>(
        "subscriptionController",
        context.reply.request.requestId,
      );
      return await subscriptionController.listSubscriptions({
        requestType: info.fieldName,
        scopeType: ENDPOINT_SCOPE_TYPE,
        request: context.reply.request,
        reply: context.reply,
        payload: args,
      });
    },
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
    // ----------------------------------------------------------------
    // Subscription
    createSubscription: async (
      _source: {},
      args: AccountModule.Payload.Controller.CreateSubscription.Input["payload"],
      context,
      info,
    ) => {
      const subscriptionController = container.get<SubscriptionController>(
        "subscriptionController",
        context.reply.request.requestId,
      );
      return await subscriptionController.createSubscription({
        requestType: info.fieldName,
        scopeType: ENDPOINT_SCOPE_TYPE,
        request: context.reply.request,
        reply: context.reply,
        payload: args,
      });
    },
    updateSubscription: async (
      _source: {},
      args: AccountModule.Payload.Controller.UpdateSubscription.Input["payload"],
      context,
      info,
    ) => {
      const subscriptionController = container.get<SubscriptionController>(
        "subscriptionController",
        context.reply.request.requestId,
      );
      return await subscriptionController.updateSubscription({
        requestType: info.fieldName,
        scopeType: ENDPOINT_SCOPE_TYPE,
        request: context.reply.request,
        reply: context.reply,
        payload: args,
      });
    },
    removeSubscription: async (
      _source: {},
      args: AccountModule.Payload.Controller.RemoveSubscription.Input["payload"],
      context,
      info,
    ) => {
      const subscriptionController = container.get<SubscriptionController>(
        "subscriptionController",
        context.reply.request.requestId,
      );
      return await subscriptionController.removeSubscription({
        requestType: info.fieldName,
        scopeType: ENDPOINT_SCOPE_TYPE,
        request: context.reply.request,
        reply: context.reply,
        payload: args,
      });
    },
  },
};
