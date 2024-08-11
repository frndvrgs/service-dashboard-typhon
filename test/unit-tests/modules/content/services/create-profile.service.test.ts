import { describe, it, expect, vi, beforeEach } from "vitest";
import { CreateProfileService } from "../../../../../src/modules/content/services";
import { AppException } from "../../../../../src/common/exceptions";
import { ProfileEntity } from "../../../../../src/modules/content/domain/entities";

import type { ProfileModel } from "../../../../../src/modules/content/domain/entities";

const mockAccountRepository = {
  select: vi.fn(),
};

const mockProfileRepository = {
  exists: vi.fn(),
  create: vi.fn(),
};

const mockMapper = {
  mapDataToView: vi.fn(),
};

const mockUUID = {
  id_account: "99018dfc-14c7-471f-a035-b0dc4b6cb6d5",
  id_profile: "082266b7-2e2f-4c8f-9007-e353f02e8512",
};

describe("CreateProfileService", () => {
  let service: CreateProfileService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new CreateProfileService(
      {
        account: mockAccountRepository,
        profile: mockProfileRepository,
      },
      mockMapper,
    );
    vi.spyOn(ProfileEntity, "create");
  });

  it("should create a profile successfully", async () => {
    const input = {
      payload: {
        account: { field: "id_account", value: mockUUID.id_account },
        input: {
          username: "testuser",
          name: "Test User",
          description: "A test description",
        },
      },
    };

    mockAccountRepository.select.mockResolvedValue({
      id_account: mockUUID.id_account,
    });
    mockProfileRepository.exists.mockResolvedValue(false);

    const entityExport: ProfileModel = {
      id: mockUUID.id_profile,
      createdAt: "2024-08-11T11:57:43.353Z",
      updatedAt: "2024-08-11T11:57:43.353Z",
      idAccount: mockUUID.id_account,
      username: "testuser",
      name: "Test User",
      document: { description: "A test description" },
    };

    const mockProfileEntity = { export: vi.fn().mockReturnValue(entityExport) };
    vi.mocked(ProfileEntity.create).mockReturnValue(
      mockProfileEntity as unknown as ProfileEntity,
    );

    const resource = {
      id_profile: mockUUID.id_profile,
      id_account: mockUUID.id_account,
      username: "testuser",
      name: "Test User",
      document: { description: "A test description" },
    };

    mockProfileRepository.create.mockResolvedValue(resource);
    mockMapper.mapDataToView.mockReturnValue({});

    const result = await service.execute(input);

    expect(mockAccountRepository.select).toHaveBeenCalledWith({
      field: "id_account",
      value: mockUUID.id_account,
    });
    expect(mockProfileRepository.exists).toHaveBeenCalledWith({
      field: "id_account",
      value: mockUUID.id_account,
    });
    expect(mockProfileRepository.exists).toHaveBeenCalledWith({
      field: "username",
      value: "testuser",
    });
    expect(ProfileEntity.create).toHaveBeenCalledWith({
      idAccount: mockUUID.id_account,
      username: "testuser",
      name: "Test User",
      document: { description: "A test description" },
    });
    expect(mockProfileRepository.create).toHaveBeenCalledWith(entityExport);
    expect(mockMapper.mapDataToView).toHaveBeenCalled();
    expect(result.status.description).toBe("PROFILE_CREATED");
    expect(result.status.code).toBe(201);
  });

  it("should throw an exception if account is not provided", async () => {
    const input = {
      payload: {
        input: {
          username: "testuser",
          name: "Test User",
        },
      },
    };

    await expect(service.execute(input)).rejects.toThrow(AppException);
  });

  it("should throw an exception if account does not exist", async () => {
    const input = {
      payload: {
        account: { field: "id_account", value: mockUUID.id_account },
        input: {
          username: "testuser",
          name: "Test User",
        },
      },
    };

    mockAccountRepository.select.mockResolvedValue(null);

    await expect(service.execute(input)).rejects.toThrow(AppException);
    expect(mockAccountRepository.select).toHaveBeenCalled();
  });

  it("should throw an exception if profile already exists for the account", async () => {
    const input = {
      payload: {
        account: { field: "id_account", value: mockUUID.id_account },
        input: {
          username: "testuser",
          name: "Test User",
        },
      },
    };

    mockAccountRepository.select.mockResolvedValue({
      id_account: mockUUID.id_account,
    });
    mockProfileRepository.exists.mockResolvedValueOnce(true);

    await expect(service.execute(input)).rejects.toThrow(AppException);
    expect(mockProfileRepository.exists).toHaveBeenCalledWith({
      field: "id_account",
      value: mockUUID.id_account,
    });
  });

  it("should throw an exception if username already exists", async () => {
    const input = {
      payload: {
        account: { field: "id_account", value: mockUUID.id_account },
        input: {
          username: "existinguser",
          name: "Test User",
        },
      },
    };

    mockAccountRepository.select.mockResolvedValue({
      id_account: mockUUID.id_account,
    });
    mockProfileRepository.exists
      .mockResolvedValueOnce(false)
      .mockResolvedValueOnce(true);

    await expect(service.execute(input)).rejects.toThrow(AppException);
    expect(mockProfileRepository.exists).toHaveBeenCalledWith({
      field: "username",
      value: "existinguser",
    });
  });

  it("should throw an exception if profile creation fails", async () => {
    const input = {
      payload: {
        account: { field: "id_account", value: mockUUID.id_account },
        input: {
          username: "testuser",
          name: "Test User",
        },
      },
    };

    mockAccountRepository.select.mockResolvedValue({
      id_account: mockUUID.id_account,
    });
    mockProfileRepository.exists.mockResolvedValue(false);
    mockProfileRepository.create.mockResolvedValue(null);

    await expect(service.execute(input)).rejects.toThrow(AppException);
    expect(mockProfileRepository.create).toHaveBeenCalled();
  });
});
