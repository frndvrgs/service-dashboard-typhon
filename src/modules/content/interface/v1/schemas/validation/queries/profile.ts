import { selectProfile } from "../../../../../../../common/interface/v1/validation";
import { TEXT_LENGTH } from "../../../../../../../common/constants";

import type { JSONSchemaType } from "ajv";
import type { CommonModule } from "@types";

export const listProfilesSchema: JSONSchemaType<
  CommonModule.Payload.Service.List.Input["payload"]
> = {
  $id: "listProfiles",
  type: "object",
  additionalProperties: false,
  properties: {
    requestType: {
      type: "string",
      minLength: 1,
    },
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
            id_profile: {
              type: "string",
              format: "uuid",
            },
            id_account: {
              type: "string",
              format: "uuid",
            },
            username: {
              type: "string",
              minLength: 1,
              maxLength: TEXT_LENGTH.PROFILE.USERNAME.MAX,
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
            id_profile: {
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
            username: {
              type: "array",
              minItems: 1,
              items: {
                type: "string",
                minLength: 1,
                maxLength: TEXT_LENGTH.PROFILE.USERNAME.MAX,
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
                within: { type: "string", nullable: true },
              },
            },
            updated_at: {
              type: "object",
              minProperties: 1,
              additionalProperties: false,
              properties: {
                before: { type: "string", format: "date-time", nullable: true },
                after: { type: "string", format: "date-time", nullable: true },
                within: { type: "string", nullable: true },
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

export const readProfileSchema: JSONSchemaType<
  CommonModule.Payload.Service.Read.Input["payload"]
> = {
  $id: "readProfile",
  type: "object",
  required: ["select"],
  additionalProperties: false,
  properties: {
    select: {
      type: "array",
      minItems: 1,
      items: selectProfile,
    },
  },
};
