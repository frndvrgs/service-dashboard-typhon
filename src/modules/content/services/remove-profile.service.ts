import { AppException } from "../../../common/exceptions";

import type { CommonModule, ContentModule } from "@types";

class RemoveProfileService implements ContentModule.Port.Service.RemoveProfile {
  private readonly repository: CommonModule.Port.Repository.Profile;

  /**
   * Constructor for the RemoveProfile application service.
   *
   * @param repository The repository interface for data storage.
   *
   */

  constructor(repository: CommonModule.Port.Repository.Profile) {
    this.repository = repository;
  }

  /**
   * Executes the remove profile process.
   *
   * @param service The input payload for removing a profile resource.
   * @returns A promise that resolves to the output payload of the profile removing.
   *
   */

  public async execute(
    service: ContentModule.Payload.Service.RemoveProfile.Input,
  ): Promise<ContentModule.Payload.Service.RemoveProfile.Output> {
    const { account } = service.payload;
    if (!account) {
      throw new AppException(
        "MISSING_PAYLOAD",
        400,
        "missing payload.",
        "service.payload.account is null or undefined.",
      );
    }

    // select original resource to remove
    const originalResource = await this.repository.select(account);
    if (originalResource == null) {
      throw new AppException(
        "NOT_FOUND",
        404,
        "resource not found.",
        `${account.field}: ${account.value}`,
      );
    }

    // remove resource and return
    const isRemoved = await this.repository.remove({
      field: "id_profile",
      value: originalResource.id_profile,
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
        description: "PROFILE_REMOVED",
        code: 204,
        context: "APPLICATION",
      },
    };
  }
}

export { RemoveProfileService };
