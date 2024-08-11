export interface ServicePort<Input, Output> {
  execute(service: Input): Promise<Output>;
}
