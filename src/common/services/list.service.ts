import { AppException } from "../exceptions";

import type { CommonModule } from "@types";

class ListService implements CommonModule.Port.Service.List {
  private readonly repository: CommonModule.Port.Repository.Generic;

  /**
   * Constructor for the ListContent application service.
   *
   * This is a service for LIST a collection of resources efficiently, without the
   * need for authorization and mapping. This service only has access to tables views,
   * since it does not perform a mapping process to ensure the ViewModel DTO.
   *
   * @param repository The repository interface for data storage.
   *
   */

  constructor(repository: CommonModule.Port.Repository.Generic) {
    this.repository = repository;
  }

  /**
   * Executes the listing resources process.
   *
   * @param service The input payload for listing a collection of resources.
   * @returns A promise that resolves to the output payload of the resources listing.
   *
   */

  public async execute(
    service: CommonModule.Payload.Service.List.Input,
  ): Promise<CommonModule.Payload.Service.List.Output> {
    const { filter, order } = service.payload;
    const collection = await this.repository.list(filter, order);
    if (collection == null) {
      throw new AppException(
        "NOTHING_FOUND",
        404,
        "collection not found.",
        "repository.list()",
      );
    }
    return {
      status: {
        description: "COLLECTION_LISTED",
        code: 200,
        context: "APPLICATION",
      },
      output: collection,
    };
  }
}

export { ListService };
