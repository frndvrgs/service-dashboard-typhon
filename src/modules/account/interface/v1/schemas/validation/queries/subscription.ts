import { selectSubscription } from "../../../../../../../common/interface/v1/validation";
import { TEXT_LENGTH, ENUM } from "../../../../../../../common/constants";

import type { JSONSchemaType } from "ajv";
import type { CommonModule } from "@types";

export const listSubscriptionsSchema: JSONSchemaType<
  CommonModule.Payload.Service.List.Input["payload"]
> = {
  $id: "listSubscriptions",
  type: "object",
  additionalProperties: false,
  properties: {
    filter: {
      type: "object",
      nullable: true,
      additionalProperties: false,
      properties: {
        equal: {
          type: "object",
          nullable: true,
          required: [],
          minProperties: 1,
          additionalProperties: false,
          properties: {
            id_subscription: { type: "string", format: "uuid" },
            id_account: { type: "string", format: "uuid" },
            email: {
              type: "string",
              format: "email",
              maxLength: TEXT_LENGTH.ACCOUNT.EMAIL.MAX,
            },
            type: {
              type: "string",
              enum: Object.values(ENUM.SUBSCRIPTION.TYPE),
            },
            status: {
              type: "string",
              enum: Object.values(ENUM.SUBSCRIPTION.STATUS),
            },
          },
        },
        match: {
          type: "object",
          nullable: true,
          required: [],
          minProperties: 1,
          additionalProperties: false,
          properties: {
            id_subscription: {
              type: "array",
              minItems: 1,
              items: { type: "string", format: "uuid" },
            },
            id_account: {
              type: "array",
              minItems: 1,
              items: { type: "string", format: "uuid" },
            },
            email: {
              type: "array",
              minItems: 1,
              items: {
                type: "string",
                format: "email",
                maxLength: TEXT_LENGTH.ACCOUNT.EMAIL.MAX,
              },
            },
            type: {
              type: "array",
              minItems: 1,
              items: {
                type: "string",
                enum: Object.values(ENUM.SUBSCRIPTION.TYPE),
              },
            },
            status: {
              type: "array",
              minItems: 1,
              items: {
                type: "string",
                enum: Object.values(ENUM.SUBSCRIPTION.STATUS),
              },
            },
          },
        },
        includes: {
          type: "object",
          nullable: true,
          required: [],
          additionalProperties: false,
        },
        date: {
          type: "object",
          nullable: true,
          required: [],
          minProperties: 1,
          additionalProperties: false,
          properties: {
            created_at: {
              type: "object",
              minProperties: 1,
              additionalProperties: false,
              properties: {
                before: { type: "string", format: "date-time", nullable: true },
                after: { type: "string", format: "date-time", nullable: true },
                within: { type: "string", format: "date-time", nullable: true },
              },
            },
            updated_at: {
              type: "object",
              minProperties: 1,
              additionalProperties: false,
              properties: {
                before: { type: "string", format: "date-time", nullable: true },
                after: { type: "string", format: "date-time", nullable: true },
                within: { type: "string", format: "date-time", nullable: true },
              },
            },
          },
        },
      },
    },
    order: {
      type: "object",
      nullable: true,
      additionalProperties: false,
      dependencies: {
        limit: ["field"],
        offset: ["field"],
      },
      properties: {
        field: {
          type: "object",
          nullable: true,
          required: [],
          minProperties: 1,
          additionalProperties: false,
          properties: {
            created_at: { type: "string", enum: ["ASC", "DESC"] },
            updated_at: { type: "string", enum: ["ASC", "DESC"] },
          },
        },
        limit: { type: "integer", nullable: true, minimum: 1 },
        offset: { type: "integer", nullable: true, minimum: 0 },
      },
    },
  },
};

export const readSubscription: JSONSchemaType<
  CommonModule.Payload.Service.Read.Input["payload"]
> = {
  $id: "readSubscription",
  type: "object",
  required: ["select"],
  additionalProperties: false,
  properties: {
    select: {
      type: "array",
      minItems: 1,
      items: selectSubscription,
    },
  },
};
