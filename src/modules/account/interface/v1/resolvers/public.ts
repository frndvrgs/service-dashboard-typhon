import { container } from "../../../../../core/container";

import type { AccountModule, Core } from "@types";
import type { AccountController } from "../../../controllers";

const ENDPOINT_SCOPE_TYPE = "public";

export const publicResolvers: Core.Service.MercuriusResolvers = {
  Mutation: {
    createAccount: async (
      _source,
      args: AccountModule.Payload.Controller.CreateAccount.Input["payload"],
      context,
      info,
    ) => {
      const accountController = container.get<AccountController>(
        "accountController",
        context.reply.request.requestId,
      );
      return await accountController.createAccount({
        requestType: info.fieldName,
        scopeType: ENDPOINT_SCOPE_TYPE,
        request: context.reply.request,
        reply: context.reply,
        payload: args,
      });
    },
  },
};
