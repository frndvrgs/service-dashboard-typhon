import { AppException } from "../../../common/exceptions";
import { SubscriptionEntity } from "../domain/entities";

import type { CommonModule, AccountModule } from "@types";

class UpdateSubscriptionService
  implements AccountModule.Port.Service.UpdateSubscription
{
  private readonly repository: CommonModule.Port.Repository.Subscription;
  private readonly mapper: AccountModule.Port.Mapper.Subscription;

  /**
   * Constructor for the UpdateSubscription application service.
   *
   * @param repository The repository interface for data storage.
   * @param mapper The mapper interface for managing DTOs.
   *
   */

  constructor(
    repository: CommonModule.Port.Repository.Subscription,
    mapper: AccountModule.Port.Mapper.Subscription,
  ) {
    this.repository = repository;
    this.mapper = mapper;
  }

  /**
   * Executes the update subscription process.
   *
   * @param service The input payload for updating an subscription resource.
   * @returns A promise that resolves to the output payload of the subscription updating.
   *
   */

  public async execute(
    service: AccountModule.Payload.Service.UpdateSubscription.Input,
  ): Promise<AccountModule.Payload.Service.UpdateSubscription.Output> {
    const { subscription, input } = service.payload;

    // select original resource to upload
    const originalResource = await this.repository.select(subscription);
    if (originalResource == null) {
      throw new AppException(
        "NOT_FOUND",
        404,
        "resource not found.",
        `${subscription.field}: ${subscription.value}`,
      );
    }

    // import to a new entity instance
    const entity = SubscriptionEntity.import(
      this.mapper.mapDataToEntity(originalResource),
    );

    // sorting out required fields from document fields
    const { type, status, ...additionalFields } = input;

    // update entity fields with request's payload,
    entity.update({
      type: type,
      status: status,
      document: {
        ...originalResource.document,
        ...additionalFields,
      },
    });

    // update resource with entity exports
    const resource = await this.repository.update(
      {
        field: "id_subscription",
        value: originalResource.id_subscription,
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
        description: "SUBSCRIPTION_UPDATED",
        code: 200,
        context: "APPLICATION",
      },
      output,
    };
  }
}

export { UpdateSubscriptionService };
