import { AppException } from "../exceptions";

import type { CommonModule } from "@types";

class ReadService implements CommonModule.Port.Service.Read {
  private readonly repository: CommonModule.Port.Repository.Generic;

  /**
   * Constructor for the ReadContent application service.
   *
   * @param repository The repository interface for data storage.
   *
   */

  constructor(repository: CommonModule.Port.Repository.Generic) {
    this.repository = repository;
  }

  /**
   * Executes the reading content process.
   *
   * @param service The input payload for reading a content.
   * @returns A promise that resolves to the output payload of the content reading.
   *
   */

  public async execute(
    service: CommonModule.Payload.Service.Read.Input,
  ): Promise<CommonModule.Payload.Service.Read.Output> {
    const { select } = service.payload;
    if (!select) {
      throw new AppException(
        "MISSING_PAYLOAD",
        400,
        "missing payload.",
        "service.payload.select is null or undefined.",
      );
    }

    const resource = await this.repository.read(select);
    if (resource == null) {
      throw new AppException(
        "NOT_FOUND",
        404,
        "resource not found.",
        "service.payload.select invalid field or value.",
      );
    }
    return {
      status: {
        description: "RESOURCE_READ",
        code: 200,
        context: "APPLICATION",
      },
      output: resource,
    };
  }
}

export { ReadService };
