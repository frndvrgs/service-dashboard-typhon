import { AppException } from "../../../common/exceptions";

import type { CommonModule, ProductModule } from "@types";

class RemoveWorkService implements ProductModule.Port.Service.RemoveWork {
  private readonly repository: CommonModule.Port.Repository.Work;

  /**
   * Constructor for the RemoveWork application service.
   *
   * @param repository The repository interface for data storage.
   *
   */

  constructor(repository: CommonModule.Port.Repository.Work) {
    this.repository = repository;
  }

  /**
   * Executes the work creation process.
   *
   * @param service The input payload for removing a work.
   * @returns A promise that resolves to the output payload of the work remove.
   *
   */

  public async execute(
    service: ProductModule.Payload.Service.RemoveWork.Input,
  ): Promise<ProductModule.Payload.Service.RemoveWork.Output> {
    const { account, work } = service.payload;

    // select original resource to remove
    const originalResource = await this.repository.select([account, work]);
    if (originalResource == null) {
      throw new AppException(
        "NOT_FOUND",
        404,
        "resource not found.",
        `${account.field}: ${account.value}, ${work.field}: ${work.value}`,
      );
    }

    // remove resource and return
    const isRemoved = await this.repository.remove({
      field: "id_work",
      value: originalResource.id_work,
    });
    if (!isRemoved) {
      throw new AppException(
        "INTERNAL_SERVER_ERROR",
        500,
        "database error.",
        "repository.remove() returning null.",
      );
    }
    return {
      status: {
        description: "WORK_REMOVED",
        code: 204,
        context: "APPLICATION",
      },
    };
  }
}

export { RemoveWorkService };
