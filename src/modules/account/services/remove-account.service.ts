import { AppException } from "../../../common/exceptions";

import type { CommonModule, AccountModule } from "@types";

class RemoveAccountService implements AccountModule.Port.Service.RemoveAccount {
  private readonly repository: CommonModule.Port.Repository.Account;

  /**
   * Constructor for the RemoveAccount application service.
   *
   * @param repository The repository interface for data storage.
   *
   */

  constructor(repository: CommonModule.Port.Repository.Account) {
    this.repository = repository;
  }

  /**
   * Executes the remove account process.
   *
   * @param service The input payload for reading an account resource.
   * @returns A promise that resolves to the output payload of the account reading.
   *
   */

  public async execute(
    service: AccountModule.Payload.Service.RemoveAccount.Input,
  ): Promise<AccountModule.Payload.Service.RemoveAccount.Output> {
    const { account } = service.payload;

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
    const isAccountRemoved = await this.repository.remove({
      field: "id_account",
      value: originalResource.id_account,
    });
    if (!isAccountRemoved) {
      throw new AppException(
        "INTERNAL_SERVER_ERROR",
        500,
        "database error.",
        "account repository.remove() returning null.",
      );
    }

    return {
      status: {
        description: "ACCOUNT_REMOVED",
        code: 204,
        context: "APPLICATION",
      },
    };
  }
}

export { RemoveAccountService };
