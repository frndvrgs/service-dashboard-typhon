import { describe, it, expect, vi, beforeEach } from "vitest";
import { UpdateAccountService } from "../../../../../src/modules/account/services";
import { AppException } from "../../../../../src/common/exceptions";
import { AccountEntity } from "../../../../../src/modules/account/domain/entities";

import type { AccountModel } from "../../../../../src/modules/account/domain/entities";

const mockAccountRepository = {
  select: vi.fn(),
  exists: vi.fn(),
  update: vi.fn(),
};

const mockMapper = {
  mapDataToEntity: vi.fn(),
  mapDataToView: vi.fn(),
};

const mockUUID = {
  id_account: "082266b7-2e2f-4c8f-9007-e353f02e8512",
};

describe("UpdateAccountService", () => {
  let service: UpdateAccountService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new UpdateAccountService(mockAccountRepository, mockMapper);
    vi.spyOn(AccountEntity, "import");
  });

  it("should update an account successfully", async () => {
    const input = {
      payload: {
        account: { field: "id_account", value: mockUUID.id_account },
        input: {
          email: "newemail@example.com",
          password: "newpassword123",
          additionalField: "some value",
        },
      },
    };

    const originalResource = {
      id_account: mockUUID.id_account,
      email: "oldemail@example.com",
      document: {},
    };

    const entityExport: AccountModel = {
      id: mockUUID.id_account,
      createdAt: "2024-08-11T11:57:43.353Z",
      updatedAt: "2024-08-11T11:57:43.353Z",
      email: "newemail@example.com",
      password: "hashedNewPassword123",
      scope: "user",
      document: { additionalField: "some value" },
    };

    mockAccountRepository.select.mockResolvedValue(originalResource);
    mockAccountRepository.exists.mockResolvedValue(false);

    const mockAccountEntity = {
      update: vi.fn().mockResolvedValue(undefined),
      export: vi.fn().mockReturnValue(entityExport),
    };
    vi.mocked(AccountEntity.import).mockReturnValue(
      mockAccountEntity as unknown as AccountEntity,
    );

    mockAccountRepository.update.mockResolvedValue({
      id_account: mockUUID.id_account,
      email: "newemail@example.com",
      document: { additionalField: "some value" },
    });

    mockMapper.mapDataToEntity.mockReturnValue({});
    mockMapper.mapDataToView.mockReturnValue({
      id: mockUUID.id_account,
      email: "newemail@example.com",
      additionalField: "some value",
    });

    const result = await service.execute(input);

    expect(mockAccountRepository.select).toHaveBeenCalledWith({
      field: "id_account",
      value: mockUUID.id_account,
    });
    expect(mockAccountRepository.exists).toHaveBeenCalledWith({
      field: "email",
      value: "newemail@example.com",
    });
    expect(AccountEntity.import).toHaveBeenCalled();
    expect(mockAccountEntity.update).toHaveBeenCalledWith({
      email: "newemail@example.com",
      password: "newpassword123",
      document: { additionalField: "some value" },
    });
    expect(mockAccountRepository.update).toHaveBeenCalledWith(
      { field: "id_account", value: mockUUID.id_account },
      entityExport,
    );
    expect(mockMapper.mapDataToView).toHaveBeenCalled();
    expect(result.status.description).toBe("ACCOUNT_UPDATED");
    expect(result.status.code).toBe(200);
  });

  it("should throw an exception if account does not exist", async () => {
    const input = {
      payload: {
        account: { field: "id_account", value: mockUUID.id_account },
        input: {
          email: "newemail@example.com",
        },
      },
    };

    mockAccountRepository.select.mockResolvedValue(null);

    await expect(service.execute(input)).rejects.toThrow(AppException);
    expect(mockAccountRepository.select).toHaveBeenCalledWith({
      field: "id_account",
      value: mockUUID.id_account,
    });
  });

  it("should throw an exception if new email already exists", async () => {
    const input = {
      payload: {
        account: { field: "id_account", value: mockUUID.id_account },
        input: {
          email: "existing@example.com",
        },
      },
    };

    mockAccountRepository.select.mockResolvedValue({});
    mockAccountRepository.exists.mockResolvedValue(true);

    await expect(service.execute(input)).rejects.toThrow(AppException);
    expect(mockAccountRepository.exists).toHaveBeenCalledWith({
      field: "email",
      value: "existing@example.com",
    });
  });

  it("should throw an exception if account update fails", async () => {
    const input = {
      payload: {
        account: { field: "id_account", value: mockUUID.id_account },
        input: {
          email: "newemail@example.com",
        },
      },
    };

    mockAccountRepository.select.mockResolvedValue({});
    mockAccountRepository.exists.mockResolvedValue(false);

    const mockAccountEntity = {
      update: vi.fn().mockResolvedValue(undefined),
      export: vi.fn().mockReturnValue({}),
    };
    vi.mocked(AccountEntity.import).mockReturnValue(
      mockAccountEntity as unknown as AccountEntity,
    );

    mockAccountRepository.update.mockResolvedValue(null);

    await expect(service.execute(input)).rejects.toThrow(AppException);
    expect(mockAccountRepository.update).toHaveBeenCalled();
  });
});
