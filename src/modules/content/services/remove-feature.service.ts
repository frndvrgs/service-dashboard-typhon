import { AppException } from "../../../common/exceptions";

import type { CommonModule, ContentModule } from "@types";

class RemoveFeatureService implements ContentModule.Port.Service.RemoveFeature {
  private readonly repository: CommonModule.Port.Repository.Feature;

  /**
   * Constructor for the RemoveFeature application service.
   *
   * @param repository The repository interface for data storage.
   *
   */

  constructor(repository: CommonModule.Port.Repository.Feature) {
    this.repository = repository;
  }

  /**
   * Executes the remove feature process.
   *
   * @param service The input payload for removing a feature resource.
   * @returns A promise that resolves to the output payload of the feature removing.
   *
   */

  public async execute(
    service: ContentModule.Payload.Service.RemoveFeature.Input,
  ): Promise<ContentModule.Payload.Service.RemoveFeature.Output> {
    const { feature } = service.payload;
    if (!feature) {
      throw new AppException(
        "MISSING_PAYLOAD",
        400,
        "missing payload.",
        "service.payload.account is null or undefined.",
      );
    }

    // select original resource to remove
    const originalResource = await this.repository.select(feature);
    if (originalResource == null) {
      throw new AppException(
        "NOT_FOUND",
        404,
        "resource not found.",
        `${feature.field}: ${feature.value}`,
      );
    }

    // remove resource and return
    const isRemoved = await this.repository.remove({
      field: "id_feature",
      value: originalResource.id_feature,
    });
    if (!isRemoved) {
      throw new AppException(
        "INTERNAL_SERVER_ERROR",
        500,
        "database error.",
        "repository.remove() returning null",
      );
    }
    return {
      status: {
        description: "FEATURE_REMOVED",
        code: 204,
        context: "APPLICATION",
      },
    };
  }
}

export { RemoveFeatureService };
