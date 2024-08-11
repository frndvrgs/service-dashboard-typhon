import {
  selectAccount,
  selectSubscription,
} from "../../../../../../../common/interface/v1/validation";

import type { JSONSchemaType } from "ajv";
import type { AccountModule } from "@types";

export const createSubscriptionSchema: JSONSchemaType<
  AccountModule.Payload.Service.CreateSubscription.Input["payload"]
> = {
  $id: "createSubscription",
  type: "object",
  required: ["account", "input"],
  additionalProperties: false,
  properties: {
    account: selectAccount,
    input: {
      type: "object",
      required: ["type", "status"],
      additionalProperties: false,
      properties: {
        type: {
          type: "string",
          enum: ["FREE", "BASIC", "CORPORATE"],
        },
        status: {
          type: "string",
          enum: ["ACTIVE", "INACTIVE", "CANCELED"],
        },
      },
    },
  },
};

export const updateSubscriptionSchema: JSONSchemaType<
  AccountModule.Payload.Service.UpdateSubscription.Input["payload"]
> = {
  $id: "updateSubscription",
  type: "object",
  required: ["subscription", "input"],
  additionalProperties: false,
  properties: {
    subscription: selectSubscription,
    input: {
      type: "object",
      additionalProperties: false,
      minProperties: 1,
      properties: {
        type: {
          type: "string",
          nullable: true,
          enum: ["FREE", "BASIC", "CORPORATE"],
        },
        status: {
          type: "string",
          nullable: true,
          enum: ["ACTIVE", "INACTIVE", "CANCELED"],
        },
      },
    },
  },
};

export const removeSubscriptionSchema: JSONSchemaType<
  AccountModule.Payload.Service.RemoveSubscription.Input["payload"]
> = {
  $id: "removeSubscription",
  type: "object",
  required: ["subscription"],
  additionalProperties: false,
  properties: {
    subscription: selectSubscription,
  },
};
