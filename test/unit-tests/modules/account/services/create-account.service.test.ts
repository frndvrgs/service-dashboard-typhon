import { describe, it, expect, vi, beforeEach } from "vitest";
import { CreateAccountService } from "../../../../../src/modules/account/services";
import { AppException } from "../../../../../src/common/exceptions";
import { AccountEntity } from "../../../../../src/modules/account/domain/entities";

import type { AccountModel } from "../../../../../src/modules/account/domain/entities";

const mockAccountRepository = {
  exists: vi.fn(),
  create: vi.fn(),
  beginTransaction: vi.fn(),
  commitTransaction: vi.fn(),
  rollbackTransaction: vi.fn(),
};

const mockCreateSubscriptionService = {
  execute: vi.fn(),
};

const mockMapper = {
  mapDataToView: vi.fn(),
};

const mockUUID = {
  id_account: "082266b7-2e2f-4c8f-9007-e353f02e8512",
  id_subscription: "e34e572f-724a-45c6-b9e9-f2985cd3b0b2",
};

describe("CreateAccountService", () => {
  let service: CreateAccountService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new CreateAccountService(
      { createSubscription: mockCreateSubscriptionService },
      mockAccountRepository,
      mockMapper,
    );
    vi.spyOn(AccountEntity, "create");
  });

  it("should create an account successfully", async () => {
    const input = {
      payload: {
        input: {
          email: "test@example.com",
          password: "password123",
        },
      },
    };

    const entityExport: AccountModel = {
      id: mockUUID.id_account,
      createdAt: "2024-08-11T11:57:43.353Z",
      updatedAt: "2024-08-11T11:57:43.353Z",
      email: "test@example.com",
      password: "hashedpassword123",
      scope: "user",
      document: {},
    };

    const mockAccountEntity = { export: vi.fn().mockReturnValue(entityExport) };
    vi.mocked(AccountEntity.create).mockResolvedValue(
      mockAccountEntity as unknown as AccountEntity,
    );

    mockAccountRepository.exists.mockResolvedValue(false);
    mockAccountRepository.create.mockResolvedValue({
      id_account: mockUUID.id_account,
      email: "test@example.com",
    });

    mockCreateSubscriptionService.execute.mockResolvedValue({
      output: { id_subscription: mockUUID.id_subscription },
    });

    mockMapper.mapDataToView.mockReturnValue({
      id: mockUUID.id_account,
      email: "test@example.com",
    });

    const result = await service.execute(input);

    expect(mockAccountRepository.exists).toHaveBeenCalledWith({
      field: "email",
      value: "test@example.com",
    });
    expect(AccountEntity.create).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    });
    expect(mockAccountRepository.beginTransaction).toHaveBeenCalled();
    expect(mockAccountRepository.create).toHaveBeenCalledWith(entityExport);
    expect(mockCreateSubscriptionService.execute).toHaveBeenCalledWith({
      payload: {
        account: {
          field: "id_account",
          value: mockUUID.id_account,
        },
        input: {
          type: "FREE",
          status: "ACTIVE",
        },
      },
    });
    expect(mockAccountRepository.commitTransaction).toHaveBeenCalled();
    expect(mockMapper.mapDataToView).toHaveBeenCalled();
    expect(result.status.description).toBe("ACCOUNT_CREATED");
    expect(result.status.code).toBe(201);
  });

  it("should throw an exception if email already exists", async () => {
    const input = {
      payload: {
        input: {
          email: "existing@example.com",
          password: "password123",
        },
      },
    };

    mockAccountRepository.exists.mockResolvedValue(true);

    await expect(service.execute(input)).rejects.toThrow(AppException);
    expect(mockAccountRepository.exists).toHaveBeenCalledWith({
      field: "email",
      value: "existing@example.com",
    });
    expect(AccountEntity.create).not.toHaveBeenCalled();
  });

  it("should throw an exception if account creation fails", async () => {
    const input = {
      payload: {
        input: {
          email: "test@example.com",
          password: "password123",
        },
      },
    };

    mockAccountRepository.exists.mockResolvedValue(false);
    mockAccountRepository.create.mockResolvedValue(null);

    const mockAccountEntity = { export: vi.fn().mockReturnValue({}) };
    vi.mocked(AccountEntity.create).mockResolvedValue(
      mockAccountEntity as unknown as AccountEntity,
    );

    await expect(service.execute(input)).rejects.toThrow(AppException);
    expect(mockAccountRepository.create).toHaveBeenCalled();
    expect(mockAccountRepository.rollbackTransaction).toHaveBeenCalled();
  });

  it("should throw an exception if subscription creation fails", async () => {
    const input = {
      payload: {
        input: {
          email: "test@example.com",
          password: "password123",
        },
      },
    };

    mockAccountRepository.exists.mockResolvedValue(false);
    mockAccountRepository.create.mockResolvedValue({
      id_account: mockUUID.id_account,
      email: "test@example.com",
    });

    mockCreateSubscriptionService.execute.mockResolvedValue({ output: null });

    const mockAccountEntity = { export: vi.fn().mockReturnValue({}) };
    vi.mocked(AccountEntity.create).mockResolvedValue(
      mockAccountEntity as unknown as AccountEntity,
    );

    await expect(service.execute(input)).rejects.toThrow(AppException);
    expect(mockCreateSubscriptionService.execute).toHaveBeenCalled();
    expect(mockAccountRepository.rollbackTransaction).toHaveBeenCalled();
  });
});
