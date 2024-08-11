import { AppException } from "../../../common/exceptions";
import { ProfileEntity } from "../domain/entities";

import type { CommonModule, ContentModule } from "@types";

class UpdateProfileService implements ContentModule.Port.Service.UpdateProfile {
  private readonly repository: CommonModule.Port.Repository.Profile;
  private readonly mapper: ContentModule.Port.Mapper.Profile;

  /**
   * Constructor for the UpdateProfile application service.
   *
   * @param repository The repository interface for data storage.
   * @param mapper The mapper interface for managing DTOs.
   *
   */

  constructor(
    repository: CommonModule.Port.Repository.Profile,
    mapper: ContentModule.Port.Mapper.Profile,
  ) {
    this.repository = repository;
    this.mapper = mapper;
  }

  /**
   * Executes the update profile process.
   *
   * @param service The input payload for updating an profile resource.
   * @returns A promise that resolves to the output payload of the profile updating.
   *
   */

  public async execute(
    service: ContentModule.Payload.Service.UpdateProfile.Input,
  ): Promise<ContentModule.Payload.Service.UpdateProfile.Output> {
    const { account, input } = service.payload;

    // select original resource to update
    const originalResource = await this.repository.select(account);
    if (originalResource == null) {
      throw new AppException(
        "NOT_FOUND",
        404,
        "resource not found.",
        `${account.field}: ${account.value}`,
      );
    }

    // check if username input already exists
    if (input.username != null) {
      const existsUsername = await this.repository.exists({
        field: "username",
        value: input.username,
      });
      if (existsUsername) {
        throw new AppException(
          "NOT_UNIQUE_VALUE",
          409,
          "username already exists.",
          input.username,
        );
      }
    }

    // import to a new entity instance
    const entity = ProfileEntity.import(
      this.mapper.mapDataToEntity(originalResource),
    );

    // sorting out required fields from document fields
    const { username, name, ...additionalFields } = input;

    // map from repository and update entity
    entity.update({
      username,
      name,
      document: {
        ...originalResource.document,
        ...additionalFields,
      },
    });

    // map to repository and update resource
    const resource = await this.repository.update(
      {
        field: "id_profile",
        value: originalResource.id_profile,
      },
      entity.export(),
    );
    if (!resource) {
      throw new AppException(
        "INTERNAL_SERVER_ERROR",
        500,
        "database error.",
        "repository.update() returning null.",
      );
    }

    // map to view model DTO and return
    const output = this.mapper.mapDataToView(resource);
    return {
      status: {
        description: "PROFILE_UPDATED",
        code: 200,
        context: "APPLICATION",
      },
      output,
    };
  }
}

export { UpdateProfileService };
