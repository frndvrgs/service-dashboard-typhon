import { AccountEntity } from "../domain/entities";
import { AppException } from "../../../common/exceptions";

import type { CommonModule, AccountModule } from "@types";

class CreateAccountService implements AccountModule.Port.Service.CreateAccount {
  private readonly service: {
    createSubscription: AccountModule.Port.Service.CreateSubscription;
  };
  private readonly repository: CommonModule.Port.Repository.Account;
  private readonly mapper: AccountModule.Port.Mapper.Account;

  /**
   * Constructor for the CreateAccount application service.
   *
   * @param repository The repository interface for data storage.
   * @param mapper The mapper interface for managing DTOs.
   *
   */

  constructor(
    service: {
      createSubscription: AccountModule.Port.Service.CreateSubscription;
    },
    repository: CommonModule.Port.Repository.Account,
    mapper: AccountModule.Port.Mapper.Account,
  ) {
    this.service = service;
    this.repository = repository;
    this.mapper = mapper;
  }

  /**
   * Executes the account creation process. All new Accounts gets a new FREE type Subscription.
   *
   * @param service The input payload for creating an account.
   * @returns A promise that resolves to the output payload of the account creation.
   *
   */

  public async execute(
    service: AccountModule.Payload.Service.CreateAccount.Input,
  ): Promise<AccountModule.Payload.Service.CreateAccount.Output> {
    try {
      const { input } = service.payload;

      // checking if email already exists
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

      // creating a new entity
      const entity = await AccountEntity.create({
        email: service.payload.input.email,
        password: service.payload.input.password,
      });

      // BEGIN a transaction to ensure the creation of both Account and Subscription resources
      await this.repository.beginTransaction();

      // create resource with entity exports
      const resource = await this.repository.create(entity.export());
      if (!resource) {
        throw new AppException(
          "INTERNAL_SERVER_ERROR",
          500,
          "database error.",
          "account repository.create() returning null.",
        );
      }

      // calling createSubscription service
      const subscriptionResource =
        await this.service.createSubscription.execute({
          payload: {
            account: {
              field: "id_account",
              value: resource.id_account,
            },
            input: {
              type: "FREE",
              status: "ACTIVE",
            },
          },
        });

      if (!subscriptionResource.output) {
        throw new AppException(
          "INTERNAL_SERVER_ERROR",
          500,
          "database error.",
          "subscription createSubscription.execute().output returning null.",
        );
      }

      // COMMIT the transaction with both Account and Subscription resources created.
      await this.repository.commitTransaction();

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
    } catch (err) {
      // ROLLBACK the transaction with both Account and Subscription resources not created.
      await this.repository.rollbackTransaction();

      // throw up the AppException to ensure HTTP response status output.
      throw err;
    }
  }
}

export { CreateAccountService };
