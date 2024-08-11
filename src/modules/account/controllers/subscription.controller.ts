import { BaseController } from "../../../common/abstracts";

import type { CommonModule, AccountModule } from "@types";

class SubscriptionController extends BaseController {
  private readonly listSubscriptionsService: CommonModule.Port.Service.List;
  private readonly readSubscriptionService: CommonModule.Port.Service.Read;
  private readonly createSubscriptionService: AccountModule.Port.Service.CreateSubscription;
  private readonly updateSubscriptionService: AccountModule.Port.Service.UpdateSubscription;
  private readonly removeSubscriptionService: AccountModule.Port.Service.RemoveSubscription;
  private readonly validation: AccountModule.Port.Handler.Validation.Subscription;
  private readonly session: CommonModule.Port.Handler.Session;

  /**
   * Constructor for the Subscription application service controller.
   *
   * @param service The application service for subscription resources.
   * @param status The status handler for creating status responses.
   * @param validation The validation handler for input data.
   * @param session The session handler for managing user sessions.
   *
   */

  constructor(
    listSubscriptionsService: CommonModule.Port.Service.List,
    readSubscriptionService: CommonModule.Port.Service.Read,
    createSubscriptionService: AccountModule.Port.Service.CreateSubscription,
    updateSubscriptionService: AccountModule.Port.Service.UpdateSubscription,
    removeSubscriptionService: AccountModule.Port.Service.RemoveSubscription,
    status: CommonModule.Port.Handler.Status,
    validation: AccountModule.Port.Handler.Validation.Subscription,
    session: CommonModule.Port.Handler.Session,
  ) {
    super(status);
    this.listSubscriptionsService = listSubscriptionsService;
    this.readSubscriptionService = readSubscriptionService;
    this.createSubscriptionService = createSubscriptionService;
    this.updateSubscriptionService = updateSubscriptionService;
    this.removeSubscriptionService = removeSubscriptionService;
    this.validation = validation;
    this.session = session;
  }

  /**
   * Executes the subscription collection listing process.
   *
   * @param control The control payload for listing a collection of subscriptions.
   * @returns A promise that resolves to the output payload of the collection listing.
   *
   */

  public async listSubscriptions(
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
      const service = await this.listSubscriptionsService.execute(serviceInput);
      return {
        status: this.status.createHttpStatus(service.status),
        output: service.output,
      };
    } catch (err) {
      return this.handleErrorToGraphql(err);
    }
  }

  /**
   * Executes the subscription reading process.
   *
   * @param control The control payload for reading a subscription resource.
   * @returns A promise that resolves to the output payload of the subscription reading.
   *
   */

  public async readSubscription(
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
      const service = await this.readSubscriptionService.execute(serviceInput);
      return {
        status: this.status.createHttpStatus(service.status),
        output: service.output,
      };
    } catch (err) {
      return this.handleErrorToGraphql(err);
    }
  }

  /**
   * Executes the subscription creation process.
   *
   * @param control The control payload for creating an subscription.
   * @returns A promise that resolves to the output payload of the subscription creation.
   *
   */

  public async createSubscription(
    control: AccountModule.Payload.Controller.CreateSubscription.Input,
  ): Promise<AccountModule.Payload.Controller.CreateSubscription.Output> {
    try {
      // minimum scope required for this control operation
      // control.scopeType is determined by the api entry point
      const requiredScopes = [control.scopeType];

      // authorizing and retrieving identity values from session
      await this.session.authorize(control.request, requiredScopes);

      const serviceInput: AccountModule.Payload.Service.CreateSubscription.Input =
        {
          payload: control.payload,
        };

      // payload validation
      // control.requestType is determined by resolvers or routes
      this.validation.check(control.requestType, serviceInput.payload);

      // service execution
      const service =
        await this.createSubscriptionService.execute(serviceInput);
      return {
        status: this.status.createHttpStatus(service.status),
        output: service.output,
      };
    } catch (err) {
      return this.handleErrorToGraphql(err);
    }
  }

  /**
   * Executes the update subscription process.
   *
   * @param control The control payload for updating an subscription resource.
   * @returns A promise that resolves to the output payload of the subscription updating.
   *
   */

  public async updateSubscription(
    control: AccountModule.Payload.Controller.UpdateSubscription.Input,
  ): Promise<AccountModule.Payload.Controller.UpdateSubscription.Output> {
    try {
      // minimum scope required for this control operation
      // control.scopeType is determined by the api entry point
      const requiredScopes = [control.scopeType];

      // authorizing and retrieving identity values from session
      await this.session.authorize(control.request, requiredScopes);

      const serviceInput: AccountModule.Payload.Service.UpdateSubscription.Input =
        {
          payload: control.payload,
        };

      // payload validation
      // control.requestType is determined by resolvers or routes
      this.validation.check(control.requestType, serviceInput.payload);

      // service execution
      const service =
        await this.updateSubscriptionService.execute(serviceInput);
      return {
        status: this.status.createHttpStatus(service.status),
        output: service.output,
      };
    } catch (err) {
      return this.handleErrorToGraphql(err);
    }
  }

  /**
   * Executes the remove subscription process.
   *
   * @param control The control payload for removing an subscription resource.
   * @returns A promise that resolves to the output payload of the subscription removing.
   *
   */

  public async removeSubscription(
    control: AccountModule.Payload.Controller.RemoveSubscription.Input,
  ): Promise<AccountModule.Payload.Controller.RemoveSubscription.Output> {
    try {
      // minimum scope required for this control operation
      // control.scopeType is determined by the api entry point
      const requiredScopes = [control.scopeType];

      // authorizing and retrieving identity values from session
      const identity = await this.session.authorize(
        control.request,
        requiredScopes,
      );

      let serviceInput: AccountModule.Payload.Service.RemoveSubscription.Input;

      if (control.scopeType === "service") {
        serviceInput = {
          payload: {
            subscription: control.payload.subscription,
          },
        };
      } else {
        serviceInput = {
          payload: {
            subscription: {
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
      const service =
        await this.removeSubscriptionService.execute(serviceInput);

      return {
        status: this.status.createHttpStatus(service.status),
      };
    } catch (err) {
      return this.handleErrorToGraphql(err);
    }
  }
}

export { SubscriptionController };
