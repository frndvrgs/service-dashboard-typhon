import { FeatureEntity } from "../domain/entities";
import { AppException } from "../../../common/exceptions";

import type { CommonModule, ContentModule } from "@types";

class CreateFeatureService implements ContentModule.Port.Service.CreateFeature {
  private readonly repository: CommonModule.Port.Repository.Feature;
  private readonly mapper: ContentModule.Port.Mapper.Feature;

  /**
   * Constructor for the CreateFeature application service.
   *
   * @param repository The repository interface for data storage.
   * @param mapper The mapper interface for managing DTOs.
   *
   */

  constructor(
    repository: CommonModule.Port.Repository.Feature,
    mapper: ContentModule.Port.Mapper.Feature,
  ) {
    this.repository = repository;
    this.mapper = mapper;
  }

  /**
   * Executes the feature creation process.
   *
   * @param service The input payload for creating a feature.
   * @returns A promise that resolves to the output payload of the feature creation.
   *
   */

  public async execute(
    service: ContentModule.Payload.Service.CreateFeature.Input,
  ): Promise<ContentModule.Payload.Service.CreateFeature.Output> {
    const { input } = service.payload;

    // sorting out required fields from document fields
    const { name, subscription_scope, ...documentFields } = input;

    // creating a new entity
    const entity = FeatureEntity.create({
      name,
      subscriptionScope: input.subscription_scope,
      document: {
        ...documentFields,
      },
    });

    // map to repository and create resource
    const resource = await this.repository.create(entity.export());
    if (!resource) {
      throw new AppException(
        "INTERNAL_SERVER_ERROR",
        500,
        "database error.",
        "repository.create() returned null.",
      );
    }

    // map to view model DTO and return
    const output = this.mapper.mapDataToView(resource);
    return {
      status: {
        description: "FEATURE_CREATED",
        code: 201,
        context: "APPLICATION",
      },
      output,
    };
  }
}

export { CreateFeatureService };
