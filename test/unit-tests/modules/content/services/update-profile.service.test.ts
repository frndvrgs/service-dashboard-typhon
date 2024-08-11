import { describe, it, expect, vi, beforeEach } from "vitest";
import { UpdateProfileService } from "../../../../../src/modules/content/services";
import { AppException } from "../../../../../src/common/exceptions";
import { ProfileEntity } from "../../../../../src/modules/content/domain/entities";

import type { ProfileModel } from "../../../../../src/modules/content/domain/entities";

const mockProfileRepository = {
  select: vi.fn(),
  exists: vi.fn(),
  update: vi.fn(),
};

const mockMapper = {
  mapDataToEntity: vi.fn(),
  mapDataToView: vi.fn(),
};

const mockUUID = {
  id_account: "99018dfc-14c7-471f-a035-b0dc4b6cb6d5",
  id_profile: "082266b7-2e2f-4c8f-9007-e353f02e8512",
};

describe("UpdateProfileService", () => {
  let service: UpdateProfileService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new UpdateProfileService(mockProfileRepository, mockMapper);
    vi.spyOn(ProfileEntity, "import");
  });

  it("should update a profile successfully", async () => {
    const input = {
      payload: {
        account: { field: "id_account", value: mockUUID.id_account },
        input: {
          username: "updateduser",
          name: "Updated User",
          description: "An updated description",
        },
      },
    };

    const originalResource = {
      id_profile: mockUUID.id_profile,
      id_account: mockUUID.id_account,
      username: "olduser",
      name: "Old User",
      document: { description: "An old description" },
    };

    mockProfileRepository.select.mockResolvedValue(originalResource);
    mockProfileRepository.exists.mockResolvedValue(false);

    const entityExport: ProfileModel = {
      id: mockUUID.id_profile,
      createdAt: "2024-08-11T11:57:43.353Z",
      updatedAt: "2024-08-12T10:30:00.000Z",
      idAccount: mockUUID.id_account,
      username: "updateduser",
      name: "Updated User",
      document: { description: "An updated description" },
    };

    const mockProfileEntity = {
      update: vi.fn(),
      export: vi.fn().mockReturnValue(entityExport),
    };
    vi.mocked(ProfileEntity.import).mockReturnValue(
      mockProfileEntity as unknown as ProfileEntity,
    );

    const updatedResource = {
      id_profile: mockUUID.id_profile,
      id_account: mockUUID.id_account,
      username: "updateduser",
      name: "Updated User",
      document: { description: "An updated description" },
    };

    mockProfileRepository.update.mockResolvedValue(updatedResource);
    mockMapper.mapDataToEntity.mockReturnValue({});
    mockMapper.mapDataToView.mockReturnValue({});

    const result = await service.execute(input);

    expect(mockProfileRepository.select).toHaveBeenCalledWith({
      field: "id_account",
      value: mockUUID.id_account,
    });
    expect(mockProfileRepository.exists).toHaveBeenCalledWith({
      field: "username",
      value: "updateduser",
    });
    expect(ProfileEntity.import).toHaveBeenCalled();
    expect(mockProfileEntity.update).toHaveBeenCalledWith({
      username: "updateduser",
      name: "Updated User",
      document: { description: "An updated description" },
    });
    expect(mockProfileRepository.update).toHaveBeenCalledWith(
      { field: "id_profile", value: mockUUID.id_profile },
      entityExport,
    );
    expect(mockMapper.mapDataToView).toHaveBeenCalled();
    expect(result.status.description).toBe("PROFILE_UPDATED");
    expect(result.status.code).toBe(200);
  });

  it("should throw an exception if profile does not exist", async () => {
    const input = {
      payload: {
        account: { field: "id_account", value: mockUUID.id_account },
        input: {
          username: "updateduser",
          name: "Updated User",
        },
      },
    };

    mockProfileRepository.select.mockResolvedValue(null);

    await expect(service.execute(input)).rejects.toThrow(AppException);
    expect(mockProfileRepository.select).toHaveBeenCalled();
  });

  it("should throw an exception if new username already exists", async () => {
    const input = {
      payload: {
        account: { field: "id_account", value: mockUUID.id_account },
        input: {
          username: "existinguser",
          name: "Updated User",
        },
      },
    };

    mockProfileRepository.select.mockResolvedValue({
      id_profile: mockUUID.id_profile,
    });
    mockProfileRepository.exists.mockResolvedValue(true);

    await expect(service.execute(input)).rejects.toThrow(AppException);
    expect(mockProfileRepository.exists).toHaveBeenCalledWith({
      field: "username",
      value: "existinguser",
    });
  });

  it("should update a profile without changing username", async () => {
    const input = {
      payload: {
        account: { field: "id_account", value: mockUUID.id_account },
        input: {
          name: "Updated User",
          description: "An updated description",
        },
      },
    };

    const originalResource = {
      id_profile: mockUUID.id_profile,
      id_account: mockUUID.id_account,
      username: "existinguser",
      name: "Old User",
      document: { description: "An old description" },
    };

    mockProfileRepository.select.mockResolvedValue(originalResource);

    const entityExport: ProfileModel = {
      id: mockUUID.id_profile,
      createdAt: "2024-08-11T11:57:43.353Z",
      updatedAt: "2024-08-12T10:30:00.000Z",
      idAccount: mockUUID.id_account,
      username: "existinguser",
      name: "Updated User",
      document: { description: "An updated description" },
    };

    const mockProfileEntity = {
      update: vi.fn(),
      export: vi.fn().mockReturnValue(entityExport),
    };
    vi.mocked(ProfileEntity.import).mockReturnValue(
      mockProfileEntity as unknown as ProfileEntity,
    );

    mockProfileRepository.update.mockResolvedValue(entityExport);
    mockMapper.mapDataToEntity.mockReturnValue({});
    mockMapper.mapDataToView.mockReturnValue({});

    const result = await service.execute(input);

    expect(mockProfileRepository.exists).not.toHaveBeenCalled();
    expect(result.status.description).toBe("PROFILE_UPDATED");
    expect(result.status.code).toBe(200);
  });

  it("should throw an exception if profile update fails", async () => {
    const input = {
      payload: {
        account: { field: "id_account", value: mockUUID.id_account },
        input: {
          username: "updateduser",
          name: "Updated User",
        },
      },
    };

    mockProfileRepository.select.mockResolvedValue({
      id_profile: mockUUID.id_profile,
    });
    mockProfileRepository.exists.mockResolvedValue(false);
    mockProfileRepository.update.mockResolvedValue(null);

    const mockProfileEntity = {
      update: vi.fn(),
      export: vi.fn().mockReturnValue({}),
    };
    vi.mocked(ProfileEntity.import).mockReturnValue(
      mockProfileEntity as unknown as ProfileEntity,
    );

    await expect(service.execute(input)).rejects.toThrow(AppException);
    expect(mockProfileRepository.update).toHaveBeenCalled();
  });
});
