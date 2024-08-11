import { WorkEntity } from "../domain/entities";
import { AppException } from "../../../common/exceptions";

import type { CommonModule, ProductModule } from "@types";

class CreateWorkService implements ProductModule.Port.Service.CreateWork {
  private readonly repository: {
    account: CommonModule.Port.Repository.Account;
    subscription: CommonModule.Port.Repository.Subscription;
    feature: CommonModule.Port.Repository.Feature;
    work: CommonModule.Port.Repository.Work;
  };
  private readonly mapper: ProductModule.Port.Mapper.Work;

  /**
   * Constructor for the CreateWork application service.
   *
   * @param repository The repository interface for data storage.
   * @param mapper The mapper interface for managing DTOs.
   *
   */

  constructor(
    repository: {
      account: CommonModule.Port.Repository.Account;
      subscription: CommonModule.Port.Repository.Subscription;
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
   * @param service The input payload for creating a work.
   * @returns A promise that resolves to the output payload of the work creation.
   *
   */

  public async execute(
    service: ProductModule.Payload.Service.CreateWork.Input,
  ): Promise<ProductModule.Payload.Service.CreateWork.Output> {
    const { account, feature, input } = service.payload;
    // retrieves the selected account
    const accountResource = await this.repository.account.select(account);
    if (!accountResource) {
      throw new AppException(
        "NOT_FOUND",
        404,
        "account does not exist.",
        `${account.field}: ${account.value}`,
      );
    }

    // retrieves the selected feature
    const featureResource = await this.repository.feature.select(feature);
    if (!featureResource) {
      throw new AppException(
        "NOT_FOUND",
        404,
        "feature does not exist.",
        `${feature.field}: ${feature.value}`,
      );
    }

    // retrieves the subscription from this account
    const subscriptionResource = await this.repository.subscription.select({
      field: "id_account",
      value: accountResource.id_account,
    });
    if (!subscriptionResource) {
      throw new AppException(
        "NOT_FOUND",
        404,
        "subscription does not exist.",
        `${feature.field}: ${feature.value}`,
      );
    }

    // check if subscription type allows the selected feature
    if (
      !featureResource.subscription_scope.includes(subscriptionResource.type)
    ) {
      throw new AppException(
        "NOT_ALLOWED",
        403,
        "subscription type does not allow the use of this feature.",
        `${subscriptionResource.type}`,
      );
    }

    // sorting out required fields from document fields
    const { name, level, ...documentFields } = input;

    // creating a new entity
    const entity = WorkEntity.create({
      idAccount: accountResource.id_account,
      idFeature: featureResource.id_feature,
      name,
      level,
      document: {
        ...documentFields,
        feature_name: featureResource.name,
        feature_tier: subscriptionResource.type,
      },
    });

    // map to repository and create resource
    const resource = await this.repository.work.create(entity.export());
    if (!resource) {
      throw new AppException(
        "INTERNAL_SERVER_ERROR",
        500,
        "database error.",
        "repository.create() returned null.",
      );
    }

    // map to view model DTO and return
    const output = this.mapper.mapDataToView(resource);
    return {
      status: {
        description: "FEATURE_CREATED",
        code: 201,
        context: "APPLICATION",
      },
      output,
    };
  }
}

export { CreateWorkService };
