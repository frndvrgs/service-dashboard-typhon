import { errorTools } from "../helpers/error-tools";
import { BaseException } from "../abstracts/base.exception";

import type { CommonModule } from "@types";

export class DomainException extends BaseException {
  constructor(
    description: CommonModule.Payload.DescriptionCodes,
    code: CommonModule.Payload.StatusCodes,
    message: string,
    detail: string,
    error?: Error | AggregateError | unknown,
  ) {
    super(
      "Domain Exception",
      description,
      code,
      message,
      detail,
      "DOMAIN",
      errorTools.getScope(),
      error,
    );
  }
}
