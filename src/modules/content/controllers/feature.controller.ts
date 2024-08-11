import { BaseController } from "../../../common/abstracts";

import type { CommonModule, ContentModule } from "@types";

class FeatureController extends BaseController {
  private readonly listFeaturesService: CommonModule.Port.Service.List;
  private readonly createFeatureService: ContentModule.Port.Service.CreateFeature;
  private readonly updateFeatureService: ContentModule.Port.Service.UpdateFeature;
  private readonly removeFeatureService: ContentModule.Port.Service.RemoveFeature;
  private readonly validation: ContentModule.Port.Handler.Validation.Feature;
  private readonly session: CommonModule.Port.Handler.Session;

  /**
   * Constructor for the Feature application service controller.
   *
   * @param service The application service for feature resources.
   * @param status The status handler for creating status responses.
   * @param validation The validation handler for input data.
   * @param session The session handler for managing user sessions.
   *
   */

  constructor(
    listFeaturesService: CommonModule.Port.Service.List,
    createFeatureService: ContentModule.Port.Service.CreateFeature,
    updateFeatureService: ContentModule.Port.Service.UpdateFeature,
    removeFeatureService: ContentModule.Port.Service.RemoveFeature,
    status: CommonModule.Port.Handler.Status,
    validation: ContentModule.Port.Handler.Validation.Feature,
    session: CommonModule.Port.Handler.Session,
  ) {
    super(status);
    this.listFeaturesService = listFeaturesService;
    this.createFeatureService = createFeatureService;
    this.updateFeatureService = updateFeatureService;
    this.removeFeatureService = removeFeatureService;
    this.validation = validation;
    this.session = session;
  }

  /**
   * Executes the work collection listing process.
   *
   * @param control The control payload for listing a collection of features.
   * @returns A promise that resolves to the output payload of the collection listing.
   *
   */

  public async listFeatures(
    control: CommonModule.Payload.Controller.List.Input,
  ): Promise<CommonModule.Payload.Controller.List.Output> {
    try {
      const serviceInput: CommonModule.Payload.Service.List.Input = {
        payload: control.payload,
      };

      // payload validation
      // control.requestType is determined by resolvers or routes
      this.validation.check(control.requestType, serviceInput.payload);

      // service execution
      const service = await this.listFeaturesService.execute({
        payload: control.payload,
      });
      return {
        status: this.status.createHttpStatus(service.status),
        output: service.output,
      };
    } catch (err) {
      return this.handleErrorToGraphql(err);
    }
  }

  /**
   * Executes the feature creation process.
   *
   * @param control The control payload for creating an feature.
   * @returns A promise that resolves to the output payload of the feature creation.
   *
   */

  public async createFeature(
    control: ContentModule.Payload.Controller.CreateFeature.Input,
  ): Promise<ContentModule.Payload.Controller.CreateFeature.Output> {
    try {
      // minimum scope required for this control operation
      // control.scopeType is determined by the api entry point
      const requiredScopes = [control.scopeType];

      // authorizing session
      await this.session.authorize(control.request, requiredScopes);

      const serviceInput: ContentModule.Payload.Service.CreateFeature.Input = {
        payload: control.payload,
      };

      // payload validation
      // control.requestType is determined by resolvers or routes
      this.validation.check(control.requestType, serviceInput.payload);

      // service execution
      const service = await this.createFeatureService.execute({
        payload: control.payload,
      });
      return {
        status: this.status.createHttpStatus(service.status),
        output: service.output,
      };
    } catch (err) {
      return this.handleErrorToGraphql(err);
    }
  }

  /**
   * Executes the update feature process.
   *
   * @param control The control payload for updating an feaeture resource.
   * @returns A promise that resolves to the output payload of the feature updating.
   *
   */

  public async updateFeature(
    control: ContentModule.Payload.Controller.UpdateFeature.Input,
  ): Promise<ContentModule.Payload.Controller.UpdateFeature.Output> {
    try {
      // minimum scope required for this control operation
      // control.scopeType is determined by the api entry point
      const requiredScopes = [control.scopeType];

      // authorizing session
      await this.session.authorize(control.request, requiredScopes);

      const serviceInput: ContentModule.Payload.Service.UpdateFeature.Input = {
        payload: control.payload,
      };

      // payload validation
      // control.requestType is determined by resolvers or routes
      this.validation.check(control.requestType, serviceInput.payload);

      // service execution
      const service = await this.updateFeatureService.execute({
        payload: control.payload,
      });
      return {
        status: this.status.createHttpStatus(service.status),
        output: service.output,
      };
    } catch (err) {
      return this.handleErrorToGraphql(err);
    }
  }

  /**
   * Executes the remove feature process.
   *
   * @param control The control payload for removing an feature resource.
   * @returns A promise that resolves to the output payload of the feature removing.
   *
   */

  public async removeFeature(
    control: ContentModule.Payload.Controller.RemoveFeature.Input,
  ): Promise<ContentModule.Payload.Controller.RemoveFeature.Output> {
    try {
      // minimum scope required for this control operation
      // control.scopeType is determined by the api entry point
      const requiredScopes = [control.scopeType];

      // authorizing session
      await this.session.authorize(control.request, requiredScopes);

      const serviceInput: ContentModule.Payload.Service.RemoveFeature.Input = {
        payload: control.payload,
      };

      // payload validation
      // control.requestType is determined by resolvers or routes
      this.validation.check(control.requestType, serviceInput.payload);

      // service execution
      const service = await this.removeFeatureService.execute(serviceInput);

      return {
        status: this.status.createHttpStatus(service.status),
      };
    } catch (err) {
      return this.handleErrorToGraphql(err);
    }
  }
}

export { FeatureController };
