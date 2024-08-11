import { describe, it, expect, vi, beforeEach } from "vitest";
import { RemoveAccountService } from "../../../../../src/modules/account/services";
import { AppException } from "../../../../../src/common/exceptions";

const mockAccountRepository = {
  select: vi.fn(),
  remove: vi.fn(),
};

const mockUUID = {
  id_account: "082266b7-2e2f-4c8f-9007-e353f02e8512",
  nonexistent: "e34e572f-724a-45c6-b9e9-f2985cd3b0b2",
};

describe("RemoveAccountService", () => {
  let service: RemoveAccountService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new RemoveAccountService(mockAccountRepository);
  });

  it("should remove an account successfully", async () => {
    const input = {
      payload: {
        account: { field: "id_account", value: mockUUID.id_account },
      },
    };

    const originalResource = {
      id_account: mockUUID.id_account,
      email: "test@example.com",
    };

    mockAccountRepository.select.mockResolvedValue(originalResource);
    mockAccountRepository.remove.mockResolvedValue(true);

    const result = await service.execute(input);

    expect(mockAccountRepository.select).toHaveBeenCalledWith({
      field: "id_account",
      value: mockUUID.id_account,
    });
    expect(mockAccountRepository.remove).toHaveBeenCalledWith({
      field: "id_account",
      value: mockUUID.id_account,
    });
    expect(result.status.description).toBe("ACCOUNT_REMOVED");
    expect(result.status.code).toBe(204);
  });

  it("should throw an exception if account does not exist", async () => {
    const input = {
      payload: {
        account: { field: "id_account", value: mockUUID.nonexistent },
      },
    };

    mockAccountRepository.select.mockResolvedValue(null);

    await expect(service.execute(input)).rejects.toThrow(AppException);
    expect(mockAccountRepository.select).toHaveBeenCalledWith({
      field: "id_account",
      value: mockUUID.nonexistent,
    });
    expect(mockAccountRepository.remove).not.toHaveBeenCalled();
  });

  it("should throw an exception if account removal fails", async () => {
    const input = {
      payload: {
        account: { field: "id_account", value: mockUUID.id_account },
      },
    };

    const originalResource = {
      id_account: mockUUID.id_account,
      email: "test@example.com",
    };

    mockAccountRepository.select.mockResolvedValue(originalResource);
    mockAccountRepository.remove.mockResolvedValue(false);

    await expect(service.execute(input)).rejects.toThrow(AppException);
    expect(mockAccountRepository.select).toHaveBeenCalled();
    expect(mockAccountRepository.remove).toHaveBeenCalled();
  });
});
