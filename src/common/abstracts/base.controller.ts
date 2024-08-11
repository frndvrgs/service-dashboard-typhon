import { FastifyReply } from "fastify";
import { BaseException } from "./base.exception";
import { errorTools } from "../helpers/error-tools";

import type { CommonModule } from "@types";

abstract class BaseController {
  protected readonly status: CommonModule.Port.Handler.Status;

  /**
   * Constructor for the Base controller.
   *
   * @param status The status handler for creating status responses.
   *
   */

  constructor(status: CommonModule.Port.Handler.Status) {
    this.status = status;
  }

  protected handleErrorToGraphql(
    err: Error | AggregateError | unknown,
  ): CommonModule.Payload.Controller.BaseOutput {
    if (err instanceof BaseException) {
      return {
        status: this.status.createHttpStatus(err.status),
      };
    } else {
      const status = this.status.createHttpStatus({
        description: "UNKNOWN_ERROR",
        code: 500,
        context: "INTERFACE",
        scope: errorTools.getScope(),
      });
      errorTools.log({
        message: status.description,
        scope: status.scope,
        error: err,
      });
      return { status };
    }
  }

  protected handleErrorToREST(
    err: Error | AggregateError | unknown,
    reply: FastifyReply,
  ): void {
    if (err instanceof BaseException) {
      reply.code(err.status.code || 500).send({
        status: this.status.createHttpStatus(err.status),
      });
    } else {
      const status = this.status.createHttpStatus({
        description: "UNKNOWN_ERROR",
        code: 500,
        context: "INTERFACE",
        scope: errorTools.getScope(),
      });
      errorTools.log({
        message: status.description,
        scope: status.scope,
        error: err,
      });
      reply.code(500).send({ status });
    }
  }
}

export { BaseController };
