import { settings } from "../../core/settings";

import type { CommonModule } from "@types";

const isDevelopment = settings.env.ENVIRONMENT === "DEVELOPMENT";

class StatusHandler implements CommonModule.Port.Handler.Status {
  /**
   * Creates an HTTP status object based on the provided status input.
   *
   * @param status - The layer status input object.
   * @returns The generated HTTP status DTo object which returns as API response within service output.
   *
   */
  createHttpStatus = (
    status: CommonModule.DTO.StatusModel,
  ): CommonModule.DTO.HttpStatusModel => {
    const statusList: CommonModule.Handler.Status.CodeList = {
      "1xx": {
        type: "INFORMATION",
        name: {
          100: "CONTINUE",
          101: "SWITCHING_PROTOCOL",
          102: "PROCESSING",
          103: "EARLY_HINTS",
        },
      },
      "2xx": {
        type: "SUCCESS",
        name: {
          200: "OK",
          201: "CREATED",
          202: "ACCEPTED",
          204: "NO_CONTENT",
        },
      },
      "3xx": {
        type: "REDIRECTION",
        name: {
          300: "MULTIPLE_CHOICE",
          301: "MOVED_PERMANENTLY",
          302: "FOUND",
          303: "SEE_OTHER",
          304: "NOT_MODIFIED",
          307: "TEMPORARY_REDIRECT",
          308: "PERMANENT_REDIRECT",
        },
      },
      "4xx": {
        type: "CLIENT_ERROR",
        name: {
          400: "BAD_REQUEST",
          401: "UNAUTHORIZED",
          402: "PAYMENT_REQUIRED",
          403: "FORBIDDEN",
          404: "NOT_FOUND",
          405: "METHOD_NOT_ALLOWED",
          406: "NOT_ACCEPTABLE",
          407: "PROXY_AUTHENTICATION_REQUIRED",
          408: "REQUEST_TIMEOUT",
          409: "CONFLICT",
          410: "GONE",
          411: "LENGTH_REQUIRED",
          412: "PRECONDITION_FAILED",
          413: "PAYLOAD_TOO_LARGE",
          414: "URI_TOO_LONG",
          415: "UNSUPPORTED_MEDIA_TYPE",
          416: "RANGE_NOT_SATISFIABLE",
          417: "EXPECTATION_FAILED",
          418: "IM_A_TEAPOT",
          419: "AUTHENTICATION_TIMEOUT",
          426: "UPGRADE_REQUIRED",
          428: "PRECONDITION_REQUIRED",
          429: "TOO_MANY_REQUESTS",
        },
      },
      "5xx": {
        type: "SERVER_ERROR",
        name: {
          500: "INTERNAL_SERVER_ERROR",
          501: "NOT_IMPLEMENTED",
          502: "BAD_GATEWAY",
          503: "SERVICE_UNAVAILABLE",
          504: "GATEWAY_TIMEOUT",
        },
      },
    };

    const getStatusCodeCategory = (code: number): string => {
      if (code >= 100 && code < 200) return "1xx";
      if (code >= 200 && code < 300) return "2xx";
      if (code >= 300 && code < 400) return "3xx";
      if (code >= 400 && code < 500) return "4xx";
      if (code >= 500 && code < 600) return "5xx";
      return "unknown";
    };

    const code = status.code;
    const category = getStatusCodeCategory(code);
    const type = statusList[category]?.type;
    const name =
      statusList[category]?.name[code as CommonModule.Payload.StatusCodes];

    const output: CommonModule.DTO.HttpStatusModel = {
      type: type ?? "SERVER_ERROR",
      name: name ?? "INTERNAL_SERVER_ERROR",
      description: status.description ?? "UNKNOWN_ERROR",
      code: code ?? 500,
      context: isDevelopment ? status.context : null,
      scope: isDevelopment ? status.scope : null,
      message: isDevelopment ? status.message : null,
      detail: isDevelopment ? status.detail : null,
      validation: isDevelopment ? status.validation : null,
    };

    return output;
  };
}

export { StatusHandler };
