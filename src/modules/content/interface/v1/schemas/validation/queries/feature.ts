import { ENUM } from "../../../../../../../common/constants";

import type { JSONSchemaType } from "ajv";
import type { CommonModule } from "@types";

export const listFeaturesSchema: JSONSchemaType<
  CommonModule.Payload.Service.List.Input["payload"]
> = {
  $id: "listFeatures",
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
            id_feature: {
              type: "string",
              format: "uuid",
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
            id_feature: {
              type: "array",
              minItems: 1,
              items: {
                type: "string",
                format: "uuid",
              },
            },
          },
        },
        includes: {
          type: "object",
          nullable: true,
          required: [],
          minProperties: 1,
          additionalProperties: false,
          properties: {
            subscription_scope: {
              type: "array",
              minItems: 1,
              items: {
                type: "string",
                enum: Object.values(ENUM.SUBSCRIPTION.TYPE),
              },
            },
          },
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
