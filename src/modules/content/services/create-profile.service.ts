import { ProfileEntity } from "../domain/entities";
import { AppException } from "../../../common/exceptions";

import type { CommonModule, ContentModule } from "@types";

class CreateProfileService implements ContentModule.Port.Service.CreateProfile {
  private readonly repository: {
    account: CommonModule.Port.Repository.Account;
    profile: CommonModule.Port.Repository.Profile;
  };
  private readonly mapper: ContentModule.Port.Mapper.Profile;

  /**
   * Constructor for the CreateProfile application service.
   *
   * @param repository The repository interface for data storage.
   * @param mapper The mapper interface for managing DTOs.
   *
   */

  constructor(
    repository: {
      account: CommonModule.Port.Repository.Account;
      profile: CommonModule.Port.Repository.Profile;
    },
    mapper: ContentModule.Port.Mapper.Profile,
  ) {
    this.repository = repository;
    this.mapper = mapper;
  }

  /**
   * Executes the profile creation process.
   *
   * @param service The input payload for creating an profile.
   * @returns A promise that resolves to the output payload of the profile creation.
   *
   */

  public async execute(
    service: ContentModule.Payload.Service.CreateProfile.Input,
  ): Promise<ContentModule.Payload.Service.CreateProfile.Output> {
    const { account, input } = service.payload;
    if (!account) {
      throw new AppException(
        "MISSING_PAYLOAD",
        400,
        "missing payload.",
        "service.payload.account is null or undefined.",
      );
    }

    // retrieves the account resource
    const accountResource = await this.repository.account.select(account);
    if (!accountResource) {
      throw new AppException(
        "NOT_FOUND",
        404,
        "resource not found.",
        `${account.field}: ${account.value}`,
      );
    }

    // check if id_account already have a profile
    const profileExists = await this.repository.profile.exists({
      field: "id_account",
      value: accountResource.id_account,
    });
    if (profileExists) {
      throw new AppException(
        "DUPLICATED",
        409,
        "profile already exists for this account.",
        accountResource.id_account,
      );
    }

    // check if username already exists
    const existsUsername = await this.repository.profile.exists({
      field: "username",
      value: input.username,
    });
    if (existsUsername) {
      throw new AppException(
        "NOT_UNIQUE_VALUE",
        409,
        "username already exists.",
        input.username,
      );
    }

    // sorting out required fields from document fields
    const { username, name, ...documentFields } = input;

    // creating a new entity
    const entity = ProfileEntity.create({
      idAccount: accountResource.id_account,
      username,
      name,
      document: {
        ...documentFields,
      },
    });

    // create resource with entity exports
    const resource = await this.repository.profile.create(entity.export());
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
        description: "PROFILE_CREATED",
        code: 201,
        context: "APPLICATION",
      },
      output,
    };
  }
}

export { CreateProfileService };
