import { errorTools } from "../helpers/error-tools";
import { BaseException } from "../abstracts/base.exception";

import type { CommonModule } from "@types";

export class InterfaceException extends BaseException {
  constructor(
    description: CommonModule.Payload.DescriptionCodes,
    code: CommonModule.Payload.StatusCodes,
    message: string,
    detail: string,
    error?: Error | AggregateError | unknown,
    validation?: CommonModule.Payload.Exception.ValidationObject,
  ) {
    super(
      "Interface Exception",
      description,
      code,
      message,
      detail,
      "INTERFACE",
      errorTools.getScope(),
      error,
      validation,
    );
  }
}
