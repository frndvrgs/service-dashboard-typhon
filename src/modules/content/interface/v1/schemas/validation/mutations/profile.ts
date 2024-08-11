import { selectAccount } from "../../../../../../../common/interface/v1/validation";

import type { JSONSchemaType } from "ajv";
import type { ContentModule } from "@types";

export const createProfileSchema: JSONSchemaType<
  ContentModule.Payload.Service.CreateProfile.Input["payload"]
> = {
  $id: "createProfile",
  type: "object",
  required: ["account", "input"],
  additionalProperties: false,
  properties: {
    account: selectAccount,
    input: {
      type: "object",
      required: ["username"],
      additionalProperties: false,
      properties: {
        username: {
          type: "string",
          minLength: 4,
        },
        name: {
          type: "string",
          nullable: true,
          minLength: 4,
        },
        image_url: {
          type: "string",
          nullable: true,
          format: "uri",
          minLength: 1,
        },
        description: {
          type: "string",
          nullable: true,
          minLength: 1,
        },
        website_url: {
          type: "string",
          nullable: true,
          format: "uri",
          minLength: 1,
        },
        location: {
          type: "string",
          nullable: true,
          minLength: 1,
        },
      },
    },
  },
};

export const updateProfileSchema: JSONSchemaType<
  ContentModule.Payload.Service.UpdateProfile.Input["payload"]
> = {
  $id: "updateProfile",
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
        username: {
          type: "string",
          nullable: true,
          minLength: 4,
        },
        name: {
          type: "string",
          nullable: true,
          minLength: 4,
        },
        image_url: {
          type: "string",
          nullable: true,
          format: "uri",
          minLength: 1,
        },
        description: {
          type: "string",
          nullable: true,
          minLength: 1,
        },
        website_url: {
          type: "string",
          nullable: true,
          format: "uri",
          minLength: 1,
        },
        location: {
          type: "string",
          nullable: true,
          minLength: 1,
        },
      },
    },
  },
};

export const removeProfileSchema: JSONSchemaType<
  ContentModule.Payload.Service.RemoveProfile.Input["payload"]
> = {
  $id: "removeProfile",
  type: "object",
  required: ["account"],
  additionalProperties: false,
  properties: {
    account: selectAccount,
  },
};
