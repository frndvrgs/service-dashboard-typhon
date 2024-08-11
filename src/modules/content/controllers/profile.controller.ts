import { BaseController } from "../../../common/abstracts";
import { InterfaceException } from "../../../common/exceptions";

import type { CommonModule, ContentModule } from "@types";

class ProfileController extends BaseController {
  private readonly listProfilesService: CommonModule.Port.Service.List;
  private readonly readProfileService: CommonModule.Port.Service.Read;
  private readonly createProfileService: ContentModule.Port.Service.CreateProfile;
  private readonly updateProfileService: ContentModule.Port.Service.UpdateProfile;
  private readonly removeProfileService: ContentModule.Port.Service.RemoveProfile;
  private readonly validation: ContentModule.Port.Handler.Validation.Profile;
  private readonly session: CommonModule.Port.Handler.Session;

  /**
   * Constructor for the Profile application service controller.
   *
   * @param service The application service for profile resources.
   * @param status The status handler for creating status responses.
   * @param validation The validation handler for input data.
   * @param session The session handler for managing user sessions.
   *
   */

  constructor(
    listProfilesService: CommonModule.Port.Service.List,
    readProfileService: CommonModule.Port.Service.Read,
    createProfileService: ContentModule.Port.Service.CreateProfile,
    updateProfileService: ContentModule.Port.Service.UpdateProfile,
    removeProfileService: ContentModule.Port.Service.RemoveProfile,
    status: CommonModule.Port.Handler.Status,
    validation: ContentModule.Port.Handler.Validation.Profile,
    session: CommonModule.Port.Handler.Session,
  ) {
    super(status);
    this.listProfilesService = listProfilesService;
    this.readProfileService = readProfileService;
    this.createProfileService = createProfileService;
    this.updateProfileService = updateProfileService;
    this.removeProfileService = removeProfileService;
    this.validation = validation;
    this.session = session;
  }

  /**
   * Executes the work collection listing process.
   *
   * @param control The control payload for listing a collection of profiles.
   * @returns A promise that resolves to the output payload of the collection listing.
   *
   */

  public async listProfiles(
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
      const service = await this.listProfilesService.execute({
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
   * Executes the work reading process.
   *
   * @param control The control payload for reading a work resource.
   * @returns A promise that resolves to the output payload of the work reading.
   *
   */

  public async readProfile(
    control: CommonModule.Payload.Controller.Read.Input,
  ): Promise<CommonModule.Payload.Controller.Read.Output> {
    try {
      let serviceInput: CommonModule.Payload.Service.Read.Input;

      if (!control.payload.select) {
        // verifying and retrieving identity values from session
        // session.verify() is not an authorization process
        const identity = await this.session.verify(control.request);
        if (!identity) {
          throw new InterfaceException(
            "INVALID_INPUT",
            400,
            "need to be authenticated to read without a select field.",
            "ProfileController.readProfile()",
          );
        }

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
      } else {
        serviceInput = {
          payload: {
            select: control.payload.select,
          },
        };
      }

      // payload validation
      // control.requestType is determined by resolvers or routes
      this.validation.check(control.requestType, serviceInput.payload);

      // service execution
      const service = await this.readProfileService.execute(serviceInput);
      return {
        status: this.status.createHttpStatus(service.status),
        output: service.output,
      };
    } catch (err) {
      return this.handleErrorToGraphql(err);
    }
  }

  /**
   * Executes the profile creation process.
   *
   * @param control The control payload for creating an profile.
   * @returns A promise that resolves to the output payload of the profile creation.
   *
   */

  public async createProfile(
    control: ContentModule.Payload.Controller.CreateProfile.Input,
  ): Promise<ContentModule.Payload.Controller.CreateProfile.Output> {
    try {
      // minimum scope required for this control operation
      // control.scopeType is determined by the api entry point
      const requiredScopes = [control.scopeType];

      // authorizing and retrieving identity values from session
      const identity = await this.session.authorize(
        control.request,
        requiredScopes,
      );

      let serviceInput: ContentModule.Payload.Service.CreateProfile.Input;

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
      const service = await this.createProfileService.execute(serviceInput);
      return {
        status: this.status.createHttpStatus(service.status),
        output: service.output,
      };
    } catch (err) {
      return this.handleErrorToGraphql(err);
    }
  }

  /**
   * Executes the update profile process.
   *
   * @param control The control payload for updating an profile resource.
   * @returns A promise that resolves to the output payload of the profile updating.
   *
   */

  public async updateProfile(
    control: ContentModule.Payload.Controller.UpdateProfile.Input,
  ): Promise<ContentModule.Payload.Controller.UpdateProfile.Output> {
    try {
      // minimum scope required for this control operation
      // control.scopeType is determined by the api entry point
      const requiredScopes = [control.scopeType];

      // authorizing and retrieving identity values from session
      const identity = await this.session.authorize(
        control.request,
        requiredScopes,
      );

      let serviceInput: ContentModule.Payload.Service.UpdateProfile.Input;

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
      const service = await this.updateProfileService.execute(serviceInput);
      return {
        status: this.status.createHttpStatus(service.status),
        output: service.output,
      };
    } catch (err) {
      return this.handleErrorToGraphql(err);
    }
  }

  /**
   * Executes the remove profile process.
   *
   * @param control The control payload for removing an profile resource.
   * @returns A promise that resolves to the output payload of the profile removing.
   *
   */

  public async removeProfile(
    control: ContentModule.Payload.Controller.RemoveProfile.Input,
  ): Promise<ContentModule.Payload.Controller.RemoveProfile.Output> {
    try {
      // minimum scope required for this control operation
      // control.scopeType is determined by the api entry point
      const requiredScopes = [control.scopeType];

      // authorizing and retrieving identity values from session
      const identity = await this.session.authorize(
        control.request,
        requiredScopes,
      );

      let serviceInput: ContentModule.Payload.Service.RemoveProfile.Input;

      if (control.scopeType === "service") {
        serviceInput = {
          payload: {
            account: control.payload.account!,
          },
        };
      } else {
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
      const service = await this.removeProfileService.execute(serviceInput);
      return {
        status: this.status.createHttpStatus(service.status),
      };
    } catch (err) {
      return this.handleErrorToGraphql(err);
    }
  }
}

export { ProfileController };
