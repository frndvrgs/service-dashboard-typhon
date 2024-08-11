import argon2 from "argon2";

import { AppException } from "../../../common/exceptions";

import type { CommonModule, AccountModule } from "@types";

class CreateSessionService implements AccountModule.Port.Service.CreateSession {
  private readonly repository: CommonModule.Port.Repository.Account;
  private readonly mapper: AccountModule.Port.Mapper.Account;
  /**
   * Constructor for the CreateSession application service.
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
   * Executes the session creation process.
   *
   * @param service The input payload for creating a new session.
   * @returns A promise that resolves to the output payload of the session creation.
   *
   */

  public async execute(
    service: AccountModule.Payload.Service.CreateSession.Input,
  ): Promise<AccountModule.Payload.Service.CreateSession.Output> {
    const { email, password } = service.payload.body;

    // select resource by email
    const resource = await this.repository.select({
      field: "email",
      value: email,
    });
    if (resource == null) {
      throw new AppException(
        "INVALID_SESSION",
        401,
        "invalid credentials.",
        "verification failed: email or password",
      );
    }

    // verify password
    const verified = await argon2.verify(resource.password, password);
    if (!verified) {
      throw new AppException(
        "INVALID_SESSION",
        401,
        "invalid credentials.",
        "verification failed: email or password",
      );
    }

    // map to view model DTO and return
    const output = this.mapper.mapDataToView(resource);
    return {
      status: {
        description: "SESSION_VERIFIED",
        code: 202,
        context: "APPLICATION",
      },
      output,
    };
  }
}

export { CreateSessionService };
