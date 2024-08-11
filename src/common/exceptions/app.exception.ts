import { errorTools } from "../helpers/error-tools";
import { BaseException } from "../abstracts/base.exception";

import type { CommonModule } from "@types";

export class AppException extends BaseException {
  constructor(
    description: CommonModule.Payload.DescriptionCodes,
    code: CommonModule.Payload.StatusCodes,
    message: string,
    detail: string,
    error?: Error | AggregateError | unknown,
  ) {
    super(
      "Application Exception",
      description,
      code,
      message,
      detail,
      "APPLICATION",
      errorTools.getScope(),
      error,
    );
  }
}
