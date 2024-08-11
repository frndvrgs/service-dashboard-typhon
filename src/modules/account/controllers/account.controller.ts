import { BaseController } from "../../../common/abstracts";
import { InterfaceException } from "../../../common/exceptions";

import type { CommonModule, AccountModule } from "@types";

class AccountController extends BaseController {
  private readonly listAccountsService: CommonModule.Port.Service.List;
  private readonly readAccountService: CommonModule.Port.Service.Read;
  private readonly createAccountService: AccountModule.Port.Service.CreateAccount;
  private readonly updateAccountService: AccountModule.Port.Service.UpdateAccount;
  private readonly removeAccountService: AccountModule.Port.Service.RemoveAccount;
  private readonly validation: AccountModule.Port.Handler.Validation.Account;
  private readonly session: CommonModule.Port.Handler.Session;

  /**
   * Constructor for the Account application service controller.
   *
   * @param service The application service for account resources.
   * @param status The status handler for creating status responses.
   * @param validation The validation handler for input data.
   * @param session The session handler for managing user sessions.
   *
   */

  constructor(
    listAccountsService: CommonModule.Port.Service.List,
    readAccountService: CommonModule.Port.Service.Read,
    createAccountService: AccountModule.Port.Service.CreateAccount,
    updateAccountService: AccountModule.Port.Service.UpdateAccount,
    removeAccountService: AccountModule.Port.Service.RemoveAccount,
    status: CommonModule.Port.Handler.Status,
    validation: AccountModule.Port.Handler.Validation.Account,
    session: CommonModule.Port.Handler.Session,
  ) {
    super(status);
    this.listAccountsService = listAccountsService;
    this.readAccountService = readAccountService;
    this.createAccountService = createAccountService;
    this.updateAccountService = updateAccountService;
    this.removeAccountService = removeAccountService;
    this.validation = validation;
    this.session = session;
  }

  /**
   * Executes the account collection listing process.
   *
   * @param control The control payload for listing a collection of accounts.
   * @returns A promise that resolves to the output payload of the collection listing.
   *
   */

  public async listAccounts(
    control: CommonModule.Payload.Controller.List.Input,
  ): Promise<CommonModule.Payload.Controller.List.Output> {
    try {
      // minimum scope required for this control operation
      // control.scopeType is determined by the api entry point
      const requiredScopes = [control.scopeType];

      // authorizing session
      await this.session.authorize(control.request, requiredScopes);

      const serviceInput: CommonModule.Payload.Service.List.Input = {
        payload: control.payload,
      };

      // payload validation
      // control.requestType is determined by resolvers or routes
      this.validation.check(control.requestType, serviceInput.payload);

      // service execution
      const service = await this.listAccountsService.execute(serviceInput);
      return {
        status: this.status.createHttpStatus(service.status),
        output: service.output,
      };
    } catch (err) {
      return this.handleErrorToGraphql(err);
    }
  }

  /**
   * Executes the account reading process.
   *
   * @param control The control payload for reading a account resource.
   * @returns A promise that resolves to the output payload of the account reading.
   *
   */

  public async readAccount(
    control: CommonModule.Payload.Controller.Read.Input,
  ): Promise<CommonModule.Payload.Controller.Read.Output> {
    try {
      // minimum scope required for this control operation
      // control.scopeType is determined by the api entry point
      const requiredScopes = [control.scopeType];

      // authorizing and retrieving identity values from session
      const identity = await this.session.authorize(
        control.request,
        requiredScopes,
      );

      let serviceInput: CommonModule.Payload.Service.Read.Input;

      if (control.scopeType === "service") {
        serviceInput = {
          payload: {
            select: control.payload.select,
          },
        };
      } else {
        serviceInput = {
          payload: {
            select: [
              {
                field: "id_account",
                value: identity.sub,
              },
            ],
          },
        };
      }

      // payload validation
      // control.requestType is determined by resolvers or routes
      this.validation.check(control.requestType, serviceInput.payload);

      // service execution
      const service = await this.readAccountService.execute(serviceInput);
      return {
        status: this.status.createHttpStatus(service.status),
        output: service.output,
      };
    } catch (err) {
      return this.handleErrorToGraphql(err);
    }
  }

  /**
   * Executes the account creation process.
   *
   * @param control The control payload for creating an account.
   * @returns A promise that resolves to the output payload of the account creation.
   *
   */

  public async createAccount(
    control: AccountModule.Payload.Controller.CreateAccount.Input,
  ): Promise<AccountModule.Payload.Controller.CreateAccount.Output> {
    try {
      // verifying and retrieving identity values from session
      // session.verify() is not an authorization operation
      const identity = await this.session.verify(control.request);

      // not allowing new account creations while already logged-in.
      // except service requests! admins can do anything.
      if (identity && !identity.scope.service) {
        throw new InterfaceException(
          "NOT_ALLOWED",
          403,
          "account creation not allowed while already authenticated.",
          "AccountController.createAccount()",
        );
      }

      const serviceInput: AccountModule.Payload.Service.CreateAccount.Input = {
        payload: control.payload,
      };

      // payload validation
      this.validation.check(control.requestType, serviceInput.payload);

      // service execution
      const service = await this.createAccountService.execute(serviceInput);
      return {
        status: this.status.createHttpStatus(service.status),
        output: service.output,
      };
    } catch (err) {
      return this.handleErrorToGraphql(err);
    }
  }

  /**
   * Executes the update account process.
   *
   * @param control The control payload for updating an account resource.
   * @returns A promise that resolves to the output payload of the account updating.
   *
   */

  public async updateAccount(
    control: AccountModule.Payload.Controller.UpdateAccount.Input,
  ): Promise<AccountModule.Payload.Controller.UpdateAccount.Output> {
    try {
      // minimum scope required for this control operation
      // control.scopeType is determined by the api entry point
      const requiredScopes = [control.scopeType];

      // authorizing and retrieving identity values from session
      const identity = await this.session.authorize(
        control.request,
        requiredScopes,
      );

      let serviceInput: AccountModule.Payload.Service.UpdateAccount.Input;

      if (control.scopeType === "service") {
        serviceInput = {
          payload: {
            account: control.payload.account!,
            input: control.payload.input,
          },
        };
      } else {
        serviceInput = {
          payload: {
            account: {
              field: "id_account",
              value: identity.sub,
            },
            input: control.payload.input,
          },
        };
      }

      // payload validation
      // control.requestType is determined by resolvers or routes
      this.validation.check(control.requestType, serviceInput.payload);

      // service execution
      const service = await this.updateAccountService.execute(serviceInput);
      return {
        status: this.status.createHttpStatus(service.status),
        output: service.output,
      };
    } catch (err) {
      return this.handleErrorToGraphql(err);
    }
  }

  /**
   * Executes the remove account process.
   *
   * @param control The control payload for removing an account resource.
   * @returns A promise that resolves to the output payload of the account removing.
   *
   */

  public async removeAccount(
    control: AccountModule.Payload.Controller.RemoveAccount.Input,
  ): Promise<AccountModule.Payload.Controller.RemoveAccount.Output> {
    try {
      // minimum scope required for this control operation
      // control.scopeType is determined by the api entry point
      const requiredScopes = [control.scopeType];

      // authorizing and retrieving identity values from session
      const identity = await this.session.authorize(
        control.request,
        requiredScopes,
      );

      let isOwnAccount = false;
      let serviceInput: AccountModule.Payload.Service.RemoveAccount.Input;

      if (control.scopeType === "service") {
        serviceInput = {
          payload: {
            account: control.payload.account!,
          },
        };
      } else {
        isOwnAccount = true;
        serviceInput = {
          payload: {
            account: {
              field: "id_account",
              value: identity.sub,
            },
          },
        };
      }

      // payload validation
      // control.requestType is determined by resolvers or routes
      this.validation.check(control.requestType, serviceInput.payload);

      // service execution
      const service = await this.removeAccountService.execute(serviceInput);

      // if removing user's own account, removes the active session
      if (isOwnAccount) {
        this.session.remove(control.reply);
      }

      return {
        status: this.status.createHttpStatus(service.status),
      };
    } catch (err) {
      return this.handleErrorToGraphql(err);
    }
  }
}

export { AccountController };
