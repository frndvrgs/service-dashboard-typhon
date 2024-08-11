import { AppException } from "../../../common/exceptions";

import type { CommonModule, AccountModule } from "@types";

class RemoveSubscriptionService
  implements AccountModule.Port.Service.RemoveSubscription
{
  private readonly repository: CommonModule.Port.Repository.Subscription;

  /**
   * Constructor for the RemoveSubscription application service.
   *
   * @param repository The repository interface for data storage.
   *
   */

  constructor(repository: CommonModule.Port.Repository.Subscription) {
    this.repository = repository;
  }

  /**
   * Executes the remove subscription process.
   *
   * @param service The input payload for reading an subscription resource.
   * @returns A promise that resolves to the output payload of the subscription reading.
   *
   */

  public async execute(
    service: AccountModule.Payload.Service.RemoveSubscription.Input,
  ): Promise<AccountModule.Payload.Service.RemoveSubscription.Output> {
    const { subscription } = service.payload;
    if (!subscription) {
      throw new AppException(
        "MISSING_PAYLOAD",
        400,
        "missing payload.",
        "service.payload.account is null or undefined.",
      );
    }

    // select original resource to remove
    const originalResource = await this.repository.select(subscription);
    if (originalResource == null) {
      throw new AppException(
        "NOT_FOUND",
        404,
        "resource not found.",
        `${subscription.field}: ${subscription.value}`,
      );
    }

    // remove resource and return
    const isRemoved = await this.repository.remove({
      field: "id_subscription",
      value: originalResource.id_subscription,
    });
    if (!isRemoved) {
      throw new AppException(
        "INTERNAL_SERVER_ERROR",
        500,
        "database error.",
        "subscription repository.remove() returning null.",
      );
    }
    return {
      status: {
        description: "SUBSCRIPTION_REMOVED",
        code: 204,
        context: "APPLICATION",
      },
    };
  }
}

export { RemoveSubscriptionService };
