import type { JSONSchemaType } from "ajv";
import type { CommonModule } from "@types";

import { TEXT_LENGTH, FIELD_LENGTH } from "../../../constants";

export const selectAccount: JSONSchemaType<CommonModule.Payload.Query.Select.Account> =
  {
    type: "object",
    required: ["field", "value"],
    additionalProperties: false,
    properties: {
      field: {
        type: "string",
        enum: ["id_account", "email"],
      },
      value: {
        type: "string",
        minLength: 1,
        maxLength: FIELD_LENGTH.SELECT.MAX,
      },
    },
    if: {
      properties: { field: { const: "id_account" } },
    },
    then: {
      properties: { value: { type: "string", format: "uuid" } },
    },
    else: {
      if: {
        properties: { field: { const: "email" } },
      },
      then: {
        properties: {
          value: {
            type: "string",
            format: "email",
            maxLength: TEXT_LENGTH.ACCOUNT.EMAIL.MAX,
          },
        },
      },
    },
  };

export const selectSubscription: JSONSchemaType<CommonModule.Payload.Query.Select.Subscription> =
  {
    type: "object",
    required: ["field", "value"],
    additionalProperties: false,
    properties: {
      field: {
        type: "string",
        enum: ["id_subscription", "id_account"],
      },
      value: {
        type: "string",
        format: "uuid",
      },
    },
  };

export const selectWork: JSONSchemaType<CommonModule.Payload.Query.Select.Work> =
  {
    type: "object",
    required: ["field", "value"],
    additionalProperties: false,
    properties: {
      field: {
        type: "string",
        enum: ["id_work", "id_account"],
      },
      value: {
        type: "string",
        format: "uuid",
      },
    },
  };

export const selectProfile: JSONSchemaType<CommonModule.Payload.Query.Select.Profile> =
  {
    type: "object",
    required: ["field", "value"],
    additionalProperties: false,
    properties: {
      field: {
        type: "string",
        enum: ["id_profile", "id_account", "username"],
      },
      value: {
        type: "string",
        minLength: 1,
        maxLength: FIELD_LENGTH.SELECT.MAX,
      },
    },
    if: {
      properties: { field: { enum: ["id_profile", "id_account"] } },
    },
    then: {
      properties: { value: { type: "string", format: "uuid" } },
    },
    else: {
      if: {
        properties: { field: { const: "username" } },
      },
      then: {
        properties: {
          value: {
            type: "string",
            minLength: 1,
            maxLength: TEXT_LENGTH.ACCOUNT.EMAIL.MAX,
          },
        },
      },
    },
  };

export const selectFeature: JSONSchemaType<CommonModule.Payload.Query.Select.Feature> =
  {
    type: "object",
    required: ["field", "value"],
    additionalProperties: false,
    properties: {
      field: {
        type: "string",
        const: "id_feature",
      },
      value: {
        type: "string",
        format: "uuid",
      },
    },
  };
