import { selectWork } from "../../../../../../../common/interface/v1/validation";

import type { JSONSchemaType } from "ajv";
import type { CommonModule } from "@types";

export const listWorksSchema: JSONSchemaType<
  CommonModule.Payload.Service.List.Input["payload"]
> = {
  $id: "listWorks",
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
            id_work: {
              type: "string",
              format: "uuid",
            },
            id_account: {
              type: "string",
              format: "uuid",
            },
            id_feature: {
              type: "string",
              format: "uuid",
            },
            level: {
              type: "number",
              multipleOf: 0.01,
              minimum: 0,
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
            id_work: {
              type: "array",
              minItems: 1,
              items: {
                type: "string",
                format: "uuid",
              },
            },
            id_account: {
              type: "array",
              minItems: 1,
              items: {
                type: "string",
                format: "uuid",
              },
            },
            id_feature: {
              type: "array",
              minItems: 1,
              items: {
                type: "string",
                format: "uuid",
              },
            },
            level: {
              type: "array",
              minItems: 1,
              items: {
                type: "number",
                multipleOf: 0.01,
                minimum: 0,
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

export const readWork: JSONSchemaType<
  CommonModule.Payload.Service.Read.Input["payload"]
> = {
  $id: "readWork",
  type: "object",
  required: ["select"],
  additionalProperties: false,
  properties: {
    select: {
      type: "array",
      minItems: 1,
      items: selectWork,
    },
  },
};
