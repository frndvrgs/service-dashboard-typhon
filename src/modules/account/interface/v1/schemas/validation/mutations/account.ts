import { selectAccount } from "../../../../../../../common/interface/v1/validation";
import { TEXT_LENGTH } from "../../../../../../../common/constants";

import type { JSONSchemaType } from "ajv";
import type { AccountModule } from "@types";

export const createAccountSchema: JSONSchemaType<
  AccountModule.Payload.Service.CreateAccount.Input["payload"]
> = {
  $id: "createAccount",
  type: "object",
  required: ["input"],
  additionalProperties: false,
  properties: {
    input: {
      type: "object",
      required: ["email", "password"],
      additionalProperties: false,
      properties: {
        email: {
          type: "string",
          format: "email",
          minLength: TEXT_LENGTH.ACCOUNT.EMAIL.MIN,
          maxLength: TEXT_LENGTH.ACCOUNT.EMAIL.MAX,
        },
        password: {
          type: "string",
          minLength: TEXT_LENGTH.ACCOUNT.PASSWORD.MIN,
          maxLength: TEXT_LENGTH.ACCOUNT.PASSWORD.MAX,
        },
      },
    },
  },
};

export const updateAccountSchema: JSONSchemaType<
  AccountModule.Payload.Service.UpdateAccount.Input["payload"]
> = {
  $id: "updateAccount",
  type: "object",
  required: ["account", "input"],
  additionalProperties: false,
  properties: {
    account: selectAccount,
    input: {
      type: "object",
      additionalProperties: false,
      minProperties: 1,
      properties: {
        email: {
          type: "string",
          nullable: true,
          format: "email",
          minLength: TEXT_LENGTH.ACCOUNT.EMAIL.MIN,
          maxLength: TEXT_LENGTH.ACCOUNT.EMAIL.MAX,
        },
        password: {
          type: "string",
          nullable: true,
          minLength: TEXT_LENGTH.ACCOUNT.PASSWORD.MIN,
          maxLength: TEXT_LENGTH.ACCOUNT.PASSWORD.MAX,
        },
      },
    },
  },
};

export const removeAccountSchema: JSONSchemaType<
  AccountModule.Payload.Service.RemoveAccount.Input["payload"]
> = {
  $id: "removeAccount",
  type: "object",
  required: ["account"],
  additionalProperties: false,
  properties: {
    account: selectAccount,
  },
};
