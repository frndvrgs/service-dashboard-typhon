export interface ValidationHandlerPort<ValidationSchema> {
  check: (schema: string, input: ValidationSchema) => void;
}
