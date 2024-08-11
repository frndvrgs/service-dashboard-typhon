import { AppException } from "../../../common/exceptions";
import { FeatureEntity } from "../domain/entities";

import type { CommonModule, ContentModule } from "@types";

class UpdateFeatureService implements ContentModule.Port.Service.UpdateFeature {
  private readonly repository: CommonModule.Port.Repository.Feature;
  private readonly mapper: ContentModule.Port.Mapper.Feature;

  /**
   * Constructor for the UpdateFeature application service.
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
   * Executes the update feature process.
   *
   * @param service The input payload for updating an feature resource.
   * @returns A promise that resolves to the output payload of the feature updating.
   *
   */

  public async execute(
    service: ContentModule.Payload.Service.UpdateFeature.Input,
  ): Promise<ContentModule.Payload.Service.UpdateFeature.Output> {
    const { feature, input } = service.payload;
    if (!feature) {
      throw new AppException(
        "MISSING_PAYLOAD",
        400,
        "missing payload.",
        "service.payload.account is null or undefined.",
      );
    }

    // select original resource to update
    const originalResource = await this.repository.select(feature);
    if (originalResource == null) {
      throw new AppException(
        "NOT_FOUND",
        404,
        "resource not found.",
        `${feature.field}: ${feature.value}`,
      );
    }

    // import to a new entity instance
    const entity = FeatureEntity.import(
      this.mapper.mapDataToEntity(originalResource),
    );

    // sorting out required fields from document fields
    const { name, subscription_scope, ...additionalFields } = input;

    // update entity fields with request's payload,
    entity.update({
      name,
      subscriptionScope: subscription_scope,
      document: {
        ...originalResource.document,
        ...additionalFields,
      },
    });

    // update resource with entity exports
    const resource = await this.repository.update(
      {
        field: "id_feature",
        value: originalResource.id_feature,
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
        description: "FEATURE_UPDATED",
        code: 200,
        context: "APPLICATION",
      },
      output,
    };
  }
}

export { UpdateFeatureService };
