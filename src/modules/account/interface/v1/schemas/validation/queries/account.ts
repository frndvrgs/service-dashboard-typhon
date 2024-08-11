import { selectAccount } from "../../../../../../../common/interface/v1/validation";
import { TEXT_LENGTH } from "../../../../../../../common/constants";

import type { JSONSchemaType } from "ajv";
import type { CommonModule } from "@types";

export const listAccountsSchema2: JSONSchemaType<
  CommonModule.Payload.Service.List.Input["payload"]
> = {
  $id: "listAccounts",
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
          additionalProperties: false,
          minProperties: 1,
          properties: {
            id_account: { type: "string", format: "uuid" },
            email: {
              type: "string",
              format: "email",
              maxLength: TEXT_LENGTH.ACCOUNT.EMAIL.MAX,
            },
          },
        },
        match: {
          type: "object",
          nullable: true,
          required: [],
          additionalProperties: false,
          minProperties: 1,
          properties: {
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
          additionalProperties: false,
          minProperties: 1,
          properties: {
            created_at: {
              type: "object",
              additionalProperties: false,
              minProperties: 1,
              properties: {
                before: { type: "string", format: "date-time", nullable: true },
                after: { type: "string", format: "date-time", nullable: true },
                within: { type: "string", format: "date-time", nullable: true },
              },
            },
            updated_at: {
              type: "object",
              additionalProperties: false,
              minProperties: 1,
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
          additionalProperties: false,
          minProperties: 1,
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

export const readAccountSchema: JSONSchemaType<
  CommonModule.Payload.Service.Read.Input["payload"]
> = {
  $id: "readAccount",
  type: "object",
  additionalProperties: false,
  required: ["select"],
  properties: {
    select: {
      type: "array",
      minItems: 1,
      items: selectAccount,
    },
  },
};
