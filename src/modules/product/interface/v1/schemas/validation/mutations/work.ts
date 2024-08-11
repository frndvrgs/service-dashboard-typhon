import {
  selectAccount,
  selectFeature,
  selectWork,
} from "../../../../../../../common/interface/v1/validation";

import type { JSONSchemaType } from "ajv";
import type { ProductModule } from "@types";

export const createWorkSchema: JSONSchemaType<
  ProductModule.Payload.Service.CreateWork.Input["payload"]
> = {
  $id: "createWork",
  type: "object",
  required: ["account", "feature", "input"],
  additionalProperties: false,
  properties: {
    account: selectAccount,
    feature: selectFeature,
    input: {
      type: "object",
      required: ["name", "level"],
      additionalProperties: false,
      properties: {
        name: {
          type: "string",
          minLength: 1,
        },
        level: {
          type: "number",
          multipleOf: 0.01,
          minimum: 0,
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

export const updateWorkSchema: JSONSchemaType<
  ProductModule.Payload.Service.UpdateWork.Input["payload"]
> = {
  $id: "updateWork",
  type: "object",
  required: ["account", "work", "input"],
  additionalProperties: false,
  properties: {
    account: selectAccount,
    work: selectWork,
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
        level: {
          type: "number",
          nullable: true,
          multipleOf: 0.01,
          minimum: 0,
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

export const removeWorkSchema: JSONSchemaType<
  ProductModule.Payload.Service.RemoveWork.Input["payload"]
> = {
  $id: "removeWork",
  type: "object",
  required: ["account", "work"],
  additionalProperties: false,
  properties: {
    account: selectAccount,
    work: selectWork,
  },
};
