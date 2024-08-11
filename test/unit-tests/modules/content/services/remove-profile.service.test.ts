import { describe, it, expect, vi, beforeEach } from "vitest";
import { RemoveProfileService } from "../../../../../src/modules/content/services";
import { AppException } from "../../../../../src/common/exceptions";

const mockProfileRepository = {
  select: vi.fn(),
  remove: vi.fn(),
};

const mockUUID = {
  id_account: "99018dfc-14c7-471f-a035-b0dc4b6cb6d5",
  id_profile: "082266b7-2e2f-4c8f-9007-e353f02e8512",
};

describe("RemoveProfileService", () => {
  let service: RemoveProfileService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new RemoveProfileService(mockProfileRepository);
  });

  it("should remove a profile successfully", async () => {
    const input = {
      payload: {
        account: { field: "id_account", value: mockUUID.id_account },
      },
    };

    const originalResource = {
      id_profile: mockUUID.id_profile,
      id_account: mockUUID.id_account,
      username: "testuser",
      name: "Test User",
      document: { description: "A test description" },
    };

    mockProfileRepository.select.mockResolvedValue(originalResource);
    mockProfileRepository.remove.mockResolvedValue(true);

    const result = await service.execute(input);

    expect(mockProfileRepository.select).toHaveBeenCalledWith({
      field: "id_account",
      value: mockUUID.id_account,
    });
    expect(mockProfileRepository.remove).toHaveBeenCalledWith({
      field: "id_profile",
      value: mockUUID.id_profile,
    });
    expect(result.status.description).toBe("PROFILE_REMOVED");
    expect(result.status.code).toBe(204);
  });

  it("should throw an exception if profile does not exist", async () => {
    const input = {
      payload: {
        account: { field: "id_account", value: mockUUID.id_account },
      },
    };

    mockProfileRepository.select.mockResolvedValue(null);

    await expect(service.execute(input)).rejects.toThrow(AppException);
    expect(mockProfileRepository.select).toHaveBeenCalledWith({
      field: "id_account",
      value: mockUUID.id_account,
    });
    expect(mockProfileRepository.remove).not.toHaveBeenCalled();
  });

  it("should throw an exception if profile removal fails", async () => {
    const input = {
      payload: {
        account: { field: "id_account", value: mockUUID.id_account },
      },
    };

    const originalResource = {
      id_profile: mockUUID.id_profile,
      id_account: mockUUID.id_account,
      username: "testuser",
      name: "Test User",
      document: { description: "A test description" },
    };

    mockProfileRepository.select.mockResolvedValue(originalResource);
    mockProfileRepository.remove.mockResolvedValue(false);

    await expect(service.execute(input)).rejects.toThrow(AppException);
    expect(mockProfileRepository.select).toHaveBeenCalled();
    expect(mockProfileRepository.remove).toHaveBeenCalled();
  });

  it("should throw an exception if account is not provided", async () => {
    const input = {
      payload: {},
    };

    await expect(service.execute(input)).rejects.toThrow(AppException);
    expect(mockProfileRepository.select).not.toHaveBeenCalled();
    expect(mockProfileRepository.remove).not.toHaveBeenCalled();
  });
});
