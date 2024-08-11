import { AppException } from "../../../common/exceptions";
import { AccountEntity } from "../domain/entities";

import type { CommonModule, AccountModule } from "@types";

class UpdateAccountService implements AccountModule.Port.Service.UpdateAccount {
  private readonly repository: CommonModule.Port.Repository.Account;
  private readonly mapper: AccountModule.Port.Mapper.Account;

  /**
   * Constructor for the UpdateAccount application service.
   *
   * @param repository The repository interface for data storage.
   * @param mapper The mapper interface for managing DTOs.
   *
   */

  constructor(
    repository: CommonModule.Port.Repository.Account,
    mapper: AccountModule.Port.Mapper.Account,
  ) {
    this.repository = repository;
    this.mapper = mapper;
  }

  /**
   * Executes the update account process.
   *
   * @param service The input payload for updating an account resource.
   * @returns A promise that resolves to the output payload of the account updating.
   *
   */

  public async execute(
    service: AccountModule.Payload.Service.UpdateAccount.Input,
  ): Promise<AccountModule.Payload.Service.UpdateAccount.Output> {
    const { account, input } = service.payload;

    // select original resource to upload
    const originalResource = await this.repository.select(account);
    if (originalResource == null) {
      throw new AppException(
        "NOT_FOUND",
        404,
        "resource not found.",
        `${account.field}: ${account.value}`,
      );
    }

    // check if email input already exists
    if (input.email != null) {
      const existsEmail = await this.repository.exists({
        field: "email",
        value: input.email,
      });
      if (existsEmail) {
        throw new AppException(
          "NOT_UNIQUE_VALUE",
          409,
          "email already exists.",
          input.email,
        );
      }
    }

    // import to a new entity instance
    const entity = AccountEntity.import(
      this.mapper.mapDataToEntity(originalResource),
    );

    // sorting out required fields from document fields
    const { email, password, ...additionalFields } = input;

    // update entity fields with request's payload,
    // await is need if theres a new password update
    await entity.update({
      email: input.email,
      password: input.password,
      document: {
        ...originalResource.document,
        ...additionalFields,
      },
    });

    // update resource with entity exports
    const resource = await this.repository.update(
      {
        field: "id_account",
        value: originalResource.id_account,
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

    // map resource to view model DTO and return
    const output = this.mapper.mapDataToView(resource);
    return {
      status: {
        description: "ACCOUNT_UPDATED",
        code: 200,
        context: "APPLICATION",
      },
      output,
    };
  }
}

export { UpdateAccountService };
