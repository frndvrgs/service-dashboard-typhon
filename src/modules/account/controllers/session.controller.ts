import { BaseController } from "../../../common/abstracts";

import type { CommonModule, AccountModule } from "@types";

class SessionController extends BaseController {
  private readonly createSessionService: AccountModule.Port.Service.CreateSession;
  private readonly validation: AccountModule.Port.Handler.Validation.Account;
  private readonly session: CommonModule.Port.Handler.Session;

  /**
   * Constructor for the Session application service controller.
   *
   * @param service The application service for session resources.
   * @param status The status handler for creating status responses.
   * @param validation The validation handler for input data.
   * @param session The session handler for managing user sessions.
   *
   */

  constructor(
    createSessionService: AccountModule.Port.Service.CreateSession,
    status: CommonModule.Port.Handler.Status,
    validation: AccountModule.Port.Handler.Validation.Account,
    session: CommonModule.Port.Handler.Session,
  ) {
    super(status);
    this.createSessionService = createSessionService;
    this.validation = validation;
    this.session = session;
  }

  /**
   * Executes the create session process.
   *
   * @param control The control payload for creaeting a new session.
   * @returns A promise that resolves to the output payload of the session creation.
   *
   */

  public async createSession(
    control: AccountModule.Payload.Controller.CreateSession.Input,
  ): Promise<void> {
    try {
      this.validation.check("createSession", control.payload);
      const service = await this.createSessionService.execute({
        payload: control.payload,
      });
      const session = await this.session.create(control.reply, service.output);
      control.reply.code(session.status.code).send({
        status: this.status.createHttpStatus(session.status),
      });
    } catch (err) {
      return this.handleErrorToREST(err, control.reply);
    }
  }

  /**
   * Executes the remove session process.
   *
   * @param control The control payload for removing an active session.
   * @returns A promise that resolves to the output payload of the session removing.
   *
   */

  public async removeSession(
    control: AccountModule.Payload.Controller.RemoveSession.Input,
  ): Promise<void> {
    try {
      await this.session.authorize(control.request);
      const session = this.session.remove(control.reply);
      control.reply.code(session.status.code).send({
        status: this.status.createHttpStatus(session.status),
      });
    } catch (err) {
      return this.handleErrorToREST(err, control.reply);
    }
  }
}

export { SessionController };
