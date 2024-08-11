import { BaseController } from "../../../common/abstracts";

import type { CommonModule, ProductModule } from "@types";

class WorkController extends BaseController {
  private readonly listWorksService: CommonModule.Port.Service.List;
  private readonly readWorkService: CommonModule.Port.Service.Read;
  private readonly createWorkService: ProductModule.Port.Service.CreateWork;
  private readonly updateWorkService: ProductModule.Port.Service.UpdateWork;
  private readonly removeWorkService: ProductModule.Port.Service.RemoveWork;
  private readonly validation: ProductModule.Port.Handler.Validation.Work;
  private readonly session: CommonModule.Port.Handler.Session;

  /**
   * Constructor for the Work application service controller.
   *
   * @param service The application service for work resources.
   * @param status The status handler for creating status responses.
   * @param validation The validation handler for input data.
   * @param session The session handler for managing user sessions.
   *
   */

  constructor(
    listWorksService: CommonModule.Port.Service.List,
    readWorkService: CommonModule.Port.Service.Read,
    createWorkService: ProductModule.Port.Service.CreateWork,
    updateWorkService: ProductModule.Port.Service.UpdateWork,
    removeWorkService: ProductModule.Port.Service.RemoveWork,
    status: CommonModule.Port.Handler.Status,
    validation: ProductModule.Port.Handler.Validation.Work,
    session: CommonModule.Port.Handler.Session,
  ) {
    super(status);
    this.listWorksService = listWorksService;
    this.readWorkService = readWorkService;
    this.createWorkService = createWorkService;
    this.updateWorkService = updateWorkService;
    this.removeWorkService = removeWorkService;
    this.validation = validation;
    this.session = session;
  }

  /**
   * Executes the work collection listing process.
   *
   * @param control The control payload for listing a collection of works.
   * @returns A promise that resolves to the output payload of the collection listing.
   *
   */

  public async listWorks(
    control: CommonModule.Payload.Controller.List.Input,
  ): Promise<CommonModule.Payload.Controller.List.Output> {
    try {
      // minimum scope required for this control operation
      // control.scopeType is determined by the api entry point
      const requiredScopes = [control.scopeType];

      // authorizing session
      const identity = await this.session.authorize(
        control.request,
        requiredScopes,
      );

      let serviceInput: CommonModule.Payload.Service.List.Input;

      // non-service requests can only read owned resources
      if (control.scopeType === "service") {
        serviceInput = {
          payload: control.payload,
        };
      } else {
        serviceInput = {
          payload: {
            filter: {
              match: {
                id_account: [identity.sub],
                ...control.payload.filter?.match,
              },
            },
          },
        };
      }

      // payload validation
      // control.requestType is determined by resolvers or routes
      this.validation.check(control.requestType, serviceInput.payload);

      // service execution
      const service = await this.listWorksService.execute(serviceInput);
      return {
        status: this.status.createHttpStatus(service.status),
        output: service.output,
      };
    } catch (err) {
      return this.handleErrorToGraphql(err);
    }
  }

  /**
   * Executes the work reading process.
   *
   * @param control The control payload for reading a work resource.
   * @returns A promise that resolves to the output payload of the work reading.
   *
   */

  public async readWork(
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

      // non-service requests can only read owned resources
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
              ...control.payload.select,
            ],
          },
        };
      }

      // payload validation
      // control.requestType is determined by resolvers or routes
      this.validation.check(control.requestType, serviceInput.payload);

      // service execution
      const service = await this.readWorkService.execute(serviceInput);
      return {
        status: this.status.createHttpStatus(service.status),
        output: service.output,
      };
    } catch (err) {
      return this.handleErrorToGraphql(err);
    }
  }

  /**
   * Executes the work creation process.
   *
   * @param control The control payload for creating a work.
   * @returns A promise that resolves to the output payload of the work creation.
   *
   */

  public async createWork(
    control: ProductModule.Payload.Controller.CreateWork.Input,
  ): Promise<ProductModule.Payload.Controller.CreateWork.Output> {
    try {
      // minimum scope required for this control operation
      // control.scopeType is determined by the api entry point
      const requiredScopes = [control.scopeType];

      // authorizing and retrieving identity values from session
      const identity = await this.session.authorize(
        control.request,
        requiredScopes,
      );

      let serviceInput: ProductModule.Payload.Service.CreateWork.Input;

      if (control.scopeType === "service") {
        serviceInput = {
          payload: {
            account: control.payload.account!,
            feature: control.payload.feature,
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
            feature: control.payload.feature,
            input: control.payload.input,
          },
        };
      }

      // payload validation
      // control.requestType is determined by resolvers or routes
      this.validation.check(control.requestType, serviceInput.payload);

      // service execution
      const service = await this.createWorkService.execute(serviceInput);
      return {
        status: this.status.createHttpStatus(service.status),
        output: service.output,
      };
    } catch (err) {
      return this.handleErrorToGraphql(err);
    }
  }

  /**
   * Executes the update work process.
   *
   * @param control The control payload for updating an feaeture resource.
   * @returns A promise that resolves to the output payload of the work updating.
   *
   */

  public async updateWork(
    control: ProductModule.Payload.Controller.UpdateWork.Input,
  ): Promise<ProductModule.Payload.Controller.UpdateWork.Output> {
    try {
      // minimum scope required for this control operation
      // control.scopeType is determined by the api entry point
      const requiredScopes = [control.scopeType];

      // authorizing and retrieving identity values from session
      const identity = await this.session.authorize(
        control.request,
        requiredScopes,
      );

      let serviceInput: ProductModule.Payload.Service.UpdateWork.Input;

      if (control.scopeType === "service") {
        serviceInput = {
          payload: {
            account: control.payload.account!,
            work: control.payload.work,
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
            work: control.payload.work,
            input: control.payload.input,
          },
        };
      }

      // payload validation
      // control.requestType is determined by resolvers or routes
      this.validation.check(control.requestType, serviceInput.payload);

      // service execution
      const service = await this.updateWorkService.execute(serviceInput);
      return {
        status: this.status.createHttpStatus(service.status),
        output: service.output,
      };
    } catch (err) {
      return this.handleErrorToGraphql(err);
    }
  }

  /**
   * Executes the remove work process.
   *
   * @param control The control payload for removing a work resource.
   * @returns A promise that resolves to the output payload of the work removing.
   *
   */

  public async removeWork(
    control: ProductModule.Payload.Controller.RemoveWork.Input,
  ): Promise<ProductModule.Payload.Controller.RemoveWork.Output> {
    try {
      // minimum scope required for this control operation
      // control.scopeType is determined by the api entry point
      const requiredScopes = [control.scopeType];

      // authorizing and retrieving identity values from session
      const identity = await this.session.authorize(
        control.request,
        requiredScopes,
      );

      let serviceInput: ProductModule.Payload.Service.RemoveWork.Input;

      if (control.scopeType === "service") {
        serviceInput = {
          payload: {
            account: control.payload.account!,
            work: control.payload.work,
          },
        };
      } else {
        serviceInput = {
          payload: {
            account: {
              field: "id_account",
              value: identity.sub,
            },
            work: control.payload.work,
          },
        };
      }

      // payload validation
      // control.requestType is determined by resolvers or routes
      this.validation.check(control.requestType, serviceInput.payload);

      // service execution
      const service = await this.removeWorkService.execute(serviceInput);

      return {
        status: this.status.createHttpStatus(service.status),
      };
    } catch (err) {
      return this.handleErrorToGraphql(err);
    }
  }
}

export { WorkController };
