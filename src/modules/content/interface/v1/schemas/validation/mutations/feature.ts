import { selectFeature } from "../../../../../../../common/interface/v1/validation";

import type { JSONSchemaType } from "ajv";
import type { ContentModule } from "@types";

export const createFeatureSchema: JSONSchemaType<
  ContentModule.Payload.Service.CreateFeature.Input["payload"]
> = {
  $id: "createFeature",
  type: "object",
  required: ["input"],
  additionalProperties: false,
  properties: {
    input: {
      type: "object",
      required: ["name", "subscription_scope"],
      additionalProperties: false,
      properties: {
        name: {
          type: "string",
          minLength: 1,
        },
        subscription_scope: {
          type: "array",
          minItems: 1,
          items: {
            type: "string",
            minLength: 1,
          },
        },
        description: {
          type: "string",
          nullable: true,
          minLength: 1,
        },
      },
    },
  },
};

export const updateFeatureSchema: JSONSchemaType<
  ContentModule.Payload.Service.UpdateFeature.Input["payload"]
> = {
  $id: "updateFeature",
  type: "object",
  required: ["feature", "input"],
  additionalProperties: false,
  properties: {
    feature: selectFeature,
    input: {
      type: "object",
      additionalProperties: false,
      minProperties: 1,
      properties: {
        name: {
          type: "string",
          nullable: true,
          minLength: 1,
        },
        subscription_scope: {
          type: "array",
          minItems: 1,
          nullable: true,
          items: {
            type: "string",
            minLength: 1,
          },
        },
        description: {
          type: "string",
          nullable: true,
        },
      },
    },
  },
};

export const removeFeatureSchema: JSONSchemaType<
  ContentModule.Payload.Service.RemoveFeature.Input["payload"]
> = {
  $id: "removeFeature",
  type: "object",
  required: ["feature"],
  additionalProperties: false,
  properties: {
    feature: selectFeature,
  },
};
