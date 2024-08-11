export interface StatusHandlerPort<HttpStatusInput, HttpStatusOutput> {
  createHttpStatus(status?: HttpStatusInput): HttpStatusOutput;
}
