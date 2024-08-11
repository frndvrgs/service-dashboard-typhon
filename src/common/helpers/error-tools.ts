import { logger } from "./logger";

import type { CommonModule } from "@types";

interface FormattedError {
  error: {
    message?: string;
    stack?: string;
  };
}

interface FormattedErrorList {
  error: {
    message?: string;
    stack?: string;
  }[];
}

interface LogErrorInput {
  name?: string;
  description?: CommonModule.Payload.DescriptionCodes;
  code?: CommonModule.Payload.StatusCodes;
  message?: string;
  detail?: string;
  context?: string;
  scope?: string | null;
  error?: Error | AggregateError | unknown | null;
}

const format = (
  errorObject: unknown | Error | AggregateError,
): FormattedError | FormattedErrorList | null => {
  const clear = (line: string) =>
    line.replace(/^\s+at\s+/, "").replace(/\r?\n|\r/g, " ");

  const clearStack = (stack: string) =>
    stack
      .split("\n")
      .map((line) => `- ${clear(line)}`)
      .join("\n");

  const mount = (error: Error) => ({
    message: error.message && clear(error.message),
    stack: error.stack && clearStack(error.stack),
  });

  if (errorObject instanceof AggregateError) {
    return {
      error: errorObject.errors.map((err) => mount(err)),
    };
  } else if (errorObject instanceof Error) {
    return {
      error: mount(errorObject),
    };
  } else {
    return null;
  }
};

const getScope = (): string => {
  const stack = new Error().stack;
  if (!stack) return "unknown";
  const stackLines = stack.split("\n");

  for (let i = 3; i < stackLines.length; i++) {
    const match = stackLines[i]?.match(/at (\w+)\.(\w+)/);
    if (match) {
      return `${match[1]}.${match[2]}`;
    }
  }
  return "unknown";
};

const log = (exception: LogErrorInput): void => {
  const {
    name = "UNKNOWN_ERROR",
    description,
    context,
    code = 500,
    scope,
    message,
    detail,
    error,
  } = exception || {};
  return logger
    .child({
      name,
      msg: description,
      context,
      code,
      scope,
      message,
      detail,
    })
    .error(format(error));
};

export const errorTools = {
  format,
  getScope,
  log,
};
