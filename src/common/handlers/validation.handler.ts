import Ajv from "ajv";
import ajvFormats from "ajv-formats";

import { InterfaceException, ServerException } from "../exceptions";

import type { AnySchema } from "ajv";

import type { CommonModule } from "@types";

class ValidationHandler<ValidationSchema>
  implements CommonModule.Port.Handler.Validation.Generic<ValidationSchema>
{
  private ajvCompiler: Ajv;

  constructor(schemas: Record<string, AnySchema>) {
    this.ajvCompiler = new Ajv({
      strict: true,
      allErrors: true,
      verbose: true,
    });

    // adding formats to ajv
    ajvFormats(this.ajvCompiler, [
      "uuid",
      "email",
      "date-time",
      "iso-date-time",
      "uri",
    ]);

    // adding schemas into the compiler
    this.ajvCompiler.addSchema(Object.values(schemas));
  }

  check<T>(schema: string, input: T): void {
    try {
      console.log("Schema:", JSON.stringify(schema, null, 2));
      console.log("Input:", JSON.stringify(input, null, 2));
      if (!this.ajvCompiler.validate(schema, input)) {
        const { errors } = this.ajvCompiler;

        throw new InterfaceException(
          "VALIDATION_ERROR",
          400,
          "service input validation error.",
          `${errors?.length} error(s) found.`,
          null,
          errors,
        );
      }
    } catch (err) {
      if (err instanceof InterfaceException) throw err;
      throw new ServerException(
        "INTERNAL_SERVER_ERROR",
        500,
        "validation handler internal error.",
        "ajvCompiler.validate()",
        err,
      );
    }
  }
}

export { ValidationHandler };
