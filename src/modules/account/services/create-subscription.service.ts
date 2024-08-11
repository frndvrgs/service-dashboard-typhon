import { SubscriptionEntity } from "../domain/entities";
import { AppException } from "../../../common/exceptions";

import type { CommonModule, AccountModule } from "@types";

class CreateSubscriptionService
  implements AccountModule.Port.Service.CreateSubscription
{
  private readonly repository: {
    account: CommonModule.Port.Repository.Account;
    subscription: CommonModule.Port.Repository.Subscription;
  };
  private readonly mapper: AccountModule.Port.Mapper.Subscription;

  /**
   * Constructor for the CreateSubscription application service.
   *
   * @param repository The repository interface for data storage.
   * @param mapper The mapper interface for managing DTOs.
   *
   */

  constructor(
    repository: {
      account: CommonModule.Port.Repository.Account;
      subscription: CommonModule.Port.Repository.Subscription;
    },
    mapper: AccountModule.Port.Mapper.Subscription,
  ) {
    this.repository = repository;
    this.mapper = mapper;
  }

  /**
   * Executes the subscription creation process. All new Accounts gets a new FREE type Subscription.
   *
   * @param service The input payload for creating an subscription.
   * @returns A promise that resolves to the output payload of the subscription creation.
   *
   */

  public async execute(
    service: AccountModule.Payload.Service.CreateSubscription.Input,
  ): Promise<AccountModule.Payload.Service.CreateSubscription.Output> {
    const { account, input } = service.payload;

    // retrieves the account resource
    const accountResource = await this.repository.account.select(account);
    if (!accountResource) {
      throw new AppException(
        "NOT_FOUND",
        404,
        "account does not exist.",
        `${account.field}: ${account.value}`,
      );
    }

    // creating a new entity
    const entity = SubscriptionEntity.create({
      idAccount: accountResource.id_account,
      type: input.type,
      status: input.status,
    });

    // create resource with entity exports
    const resource = await this.repository.subscription.create(entity.export());
    if (!resource) {
      throw new AppException(
        "INTERNAL_SERVER_ERROR",
        500,
        "database error.",
        "subscription repository.create() returning null.",
      );
    }

    // map to view model DTO and return
    const output = this.mapper.mapDataToView(resource);
    return {
      status: {
        description: "ACCOUNT_CREATED",
        code: 201,
        context: "APPLICATION",
      },
      output,
    };
  }
}

export { CreateSubscriptionService };
