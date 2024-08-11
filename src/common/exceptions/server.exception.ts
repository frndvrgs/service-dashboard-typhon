import { errorTools } from "../helpers/error-tools";
import { BaseException } from "../abstracts/base.exception";

import type { CommonModule } from "@types";

export class ServerException extends BaseException {
  constructor(
    description: CommonModule.Payload.DescriptionCodes,
    code: CommonModule.Payload.StatusCodes,
    message: string,
    detail: string,
    error?: Error | AggregateError | unknown,
  ) {
    super(
      "Server Exception",
      description,
      code,
      message,
      detail,
      "SERVER",
      errorTools.getScope(),
      error,
    );
  }
}
