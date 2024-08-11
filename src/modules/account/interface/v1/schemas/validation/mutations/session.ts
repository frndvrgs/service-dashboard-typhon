import type { JSONSchemaType } from "ajv";
import type { AccountModule } from "@types";

export const createSessionSchema: JSONSchemaType<
  AccountModule.Payload.Service.CreateSession.Input["payload"]
> = {
  $id: "createSession",
  type: "object",
  required: ["body"],
  additionalProperties: false,
  properties: {
    body: {
      type: "object",
      required: ["email", "password"],
      additionalProperties: false,
      properties: {
        email: {
          type: "string",
          format: "email",
          minLength: 1,
        },
        password: {
          type: "string",
          minLength: 1,
        },
      },
    },
  },
};
