export interface SessionHandlerPort<
  Request,
  Reply,
  SessionInput,
  SessionIdentity,
  SessionOutput,
> {
  create(reply: Reply, payload: SessionInput): Promise<SessionOutput>;
  remove(reply: Reply): SessionOutput;
  verify(request: Request): Promise<SessionIdentity | null>;
  authorize(
    request: Request,
    requiredScopes?: string[],
  ): Promise<SessionIdentity>;
}
