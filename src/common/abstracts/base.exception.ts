import { errorTools } from "../helpers/error-tools";

import type { CommonModule } from "@types";

abstract class BaseException extends Error {
  public status: CommonModule.DTO.StatusModel;
  constructor(
    name: string,
    description: CommonModule.Payload.DescriptionCodes,
    code: CommonModule.Payload.StatusCodes,
    message: string,
    detail: string,
    context: string,
    scope: string,
    error?: Error | AggregateError | unknown | null,
    validation?: CommonModule.Payload.Exception.ValidationObject,
  ) {
    super(message);
    this.name = name;
    this.status = {
      description,
      code,
      message,
      detail,
      context,
      scope,
      validation,
    };

    // check for Error object and log it on the console

    if (error) {
      errorTools.log({
        ...this.status,
        name: this.name,
        error,
      });
    }
  }
}

export { BaseException };
