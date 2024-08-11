import { AppException } from "../../../common/exceptions";
import { WorkEntity } from "../domain/entities";

import type { CommonModule, ProductModule } from "@types";

class UpdateWorkService implements ProductModule.Port.Service.UpdateWork {
  private readonly repository: {
    account: CommonModule.Port.Repository.Account;
    feature: CommonModule.Port.Repository.Feature;
    work: CommonModule.Port.Repository.Work;
  };
  private readonly mapper: ProductModule.Port.Mapper.Work;

  /**
   * Constructor for the UpdateWork application service.
   *
   * @param repository The repository interface for data storage.
   * @param mapper The mapper interface for managing DTOs.
   *
   */

  constructor(
    repository: {
      account: CommonModule.Port.Repository.Account;
      feature: CommonModule.Port.Repository.Feature;
      work: CommonModule.Port.Repository.Work;
    },
    mapper: ProductModule.Port.Mapper.Work,
  ) {
    this.repository = repository;
    this.mapper = mapper;
  }

  /**
   * Executes the work creation process.
   *
   * @param service The input payload for updating a work.
   * @returns A promise that resolves to the output payload of the work update.
   *
   */

  public async execute(
    service: ProductModule.Payload.Service.UpdateWork.Input,
  ): Promise<ProductModule.Payload.Service.UpdateWork.Output> {
    const { account, work, input } = service.payload;

    // select original resource to update
    const originalResource = await this.repository.work.select([account, work]);
    if (originalResource == null) {
      throw new AppException(
        "NOT_FOUND",
        404,
        "resource not found.",
        `${account.field}: ${account.value}, ${work.field}: ${work.value}`,
      );
    }

    // import to a new entity instance
    const entity = WorkEntity.import(
      this.mapper.mapDataToEntity(originalResource),
    );

    // sorting out required fields from document fields
    const { name, level, ...additionalFields } = input;

    // update entity fields with request's payload,
    entity.update({
      name,
      level,
      document: {
        ...originalResource.document,
        ...additionalFields,
      },
    });

    // update resource with entity exports
    const resource = await this.repository.work.update(
      {
        field: "id_work",
        value: originalResource.id_work,
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
        description: "WORK_UPDATED",
        code: 200,
        context: "APPLICATION",
      },
      output,
    };
  }
}

export { UpdateWorkService };
