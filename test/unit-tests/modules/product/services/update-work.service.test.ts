import { describe, it, expect, vi, beforeEach } from "vitest";
import { UpdateWorkService } from "../../../../../src/modules/product/services";
import { AppException } from "../../../../../src/common/exceptions";
import { WorkEntity } from "../../../../../src/modules/product/domain/entities";

import type { WorkModel } from "../../../../../src/modules/product/domain/entities";

const mockAccountRepository = {
  select: vi.fn(),
};

const mockFeatureRepository = {
  select: vi.fn(),
};

const mockWorkRepository = {
  select: vi.fn(),
  update: vi.fn(),
};

const mockMapper = {
  mapDataToEntity: vi.fn(),
  mapDataToView: vi.fn(),
};

const mockUUID = {
  id_account: "99018dfc-14c7-471f-a035-b0dc4b6cb6d5",
  id_feature: "082266b7-2e2f-4c8f-9007-e353f02e8512",
  id_work: "d633bcdb-99a7-44b4-b7b8-22001a90c68c",
  nonexistent: "e34e572f-724a-45c6-b9e9-f2985cd3b0b2",
};

describe("UpdateWorkService", () => {
  let service: UpdateWorkService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new UpdateWorkService(
      {
        account: mockAccountRepository,
        feature: mockFeatureRepository,
        work: mockWorkRepository,
      },
      mockMapper,
    );
    vi.spyOn(WorkEntity, "import");
  });

  it("should update a work successfully", async () => {
    const input = {
      payload: {
        account: { field: "id_account", value: mockUUID.id_account },
        work: { field: "id_work", value: mockUUID.id_work },
        input: {
          name: "Updated Work",
          level: 20,
          description: "updated work description",
        },
      },
    };

    const originalResource = {
      id_work: mockUUID.id_work,
      id_account: mockUUID.id_account,
      id_feature: mockUUID.id_feature,
      name: "Original Work",
      level: 10,
      document: {
        description: "original work description",
        feature_name: "Test Feature",
        feature_tier: "BASIC",
      },
    };

    mockWorkRepository.select.mockResolvedValue(originalResource);

    const entityExport: WorkModel = {
      id: mockUUID.id_work,
      createdAt: "2024-08-11T11:57:43.353Z",
      updatedAt: "2024-08-12T10:30:00.000Z",
      idAccount: mockUUID.id_account,
      idFeature: mockUUID.id_feature,
      name: "Updated Work",
      level: 20,
      document: {
        description: "updated work description",
        feature_name: "Test Feature",
        feature_tier: "BASIC",
      },
    };

    const mockWorkEntity = {
      update: vi.fn(),
      export: vi.fn().mockReturnValue(entityExport),
    };
    vi.mocked(WorkEntity.import).mockReturnValue(
      mockWorkEntity as unknown as WorkEntity,
    );

    const updatedResource = {
      id_work: mockUUID.id_work,
      id_account: mockUUID.id_account,
      id_feature: mockUUID.id_feature,
      name: "Updated Work",
      level: 20,
      document: {
        description: "updated work description",
        feature_name: "Test Feature",
        feature_tier: "BASIC",
      },
    };

    mockWorkRepository.update.mockResolvedValue(updatedResource);
    mockMapper.mapDataToEntity.mockReturnValue({});
    mockMapper.mapDataToView.mockReturnValue({});

    const result = await service.execute(input);

    expect(mockWorkRepository.select).toHaveBeenCalledWith([
      { field: "id_account", value: mockUUID.id_account },
      { field: "id_work", value: mockUUID.id_work },
    ]);
    expect(WorkEntity.import).toHaveBeenCalled();
    expect(mockWorkEntity.update).toHaveBeenCalledWith({
      name: "Updated Work",
      level: 20,
      document: {
        description: "updated work description",
        feature_name: "Test Feature",
        feature_tier: "BASIC",
      },
    });
    expect(mockWorkRepository.update).toHaveBeenCalledWith(
      { field: "id_work", value: mockUUID.id_work },
      entityExport,
    );
    expect(mockMapper.mapDataToView).toHaveBeenCalled();
    expect(result.status.description).toBe("WORK_UPDATED");
    expect(result.status.code).toBe(200);
  });

  it("should throw an exception if work does not exist", async () => {
    const input = {
      payload: {
        account: { field: "id_account", value: mockUUID.id_account },
        work: { field: "id_work", value: mockUUID.nonexistent },
        input: {
          name: "Updated Work",
          level: 20,
        },
      },
    };

    mockWorkRepository.select.mockResolvedValue(null);

    await expect(service.execute(input)).rejects.toThrow(AppException);
    expect(mockWorkRepository.select).toHaveBeenCalled();
  });

  it("should throw an exception if work update fails", async () => {
    const input = {
      payload: {
        account: { field: "id_account", value: mockUUID.id_account },
        work: { field: "id_work", value: mockUUID.id_work },
        input: {
          name: "Updated Work",
          level: 20,
        },
      },
    };

    const originalResource = {
      id_work: mockUUID.id_work,
      id_account: mockUUID.id_account,
      id_feature: mockUUID.id_feature,
      name: "Original Work",
      level: 10,
      document: {
        description: "original work description",
        feature_name: "Test Feature",
        feature_tier: "BASIC",
      },
    };

    mockWorkRepository.select.mockResolvedValue(originalResource);

    const mockWorkEntity = {
      update: vi.fn(),
      export: vi.fn().mockReturnValue({}),
    };
    vi.mocked(WorkEntity.import).mockReturnValue(
      mockWorkEntity as unknown as WorkEntity,
    );

    mockWorkRepository.update.mockResolvedValue(null);

    await expect(service.execute(input)).rejects.toThrow(AppException);
    expect(mockWorkRepository.update).toHaveBeenCalled();
  });

  it("should update a work with additional document fields", async () => {
    const input = {
      payload: {
        account: { field: "id_account", value: mockUUID.id_account },
        work: { field: "id_work", value: mockUUID.id_work },
        input: {
          name: "Updated Work",
          level: 20,
          description: "updated work description",
          newField: "new value",
        },
      },
    };

    const originalResource = {
      id_work: mockUUID.id_work,
      id_account: mockUUID.id_account,
      id_feature: mockUUID.id_feature,
      name: "Original Work",
      level: 10,
      document: {
        description: "original work description",
        feature_name: "Test Feature",
        feature_tier: "BASIC",
      },
    };

    mockWorkRepository.select.mockResolvedValue(originalResource);

    const entityExport: WorkModel = {
      id: mockUUID.id_work,
      createdAt: "2024-08-11T11:57:43.353Z",
      updatedAt: "2024-08-12T10:30:00.000Z",
      idAccount: mockUUID.id_account,
      idFeature: mockUUID.id_feature,
      name: "Updated Work",
      level: 20,
      document: {
        description: "updated work description",
        feature_name: "Test Feature",
        feature_tier: "BASIC",
        newField: "new value",
      },
    };

    const mockWorkEntity = {
      update: vi.fn(),
      export: vi.fn().mockReturnValue(entityExport),
    };
    vi.mocked(WorkEntity.import).mockReturnValue(
      mockWorkEntity as unknown as WorkEntity,
    );

    const updatedResource = {
      id_work: mockUUID.id_work,
      id_account: mockUUID.id_account,
      id_feature: mockUUID.id_feature,
      name: "Updated Work",
      level: 20,
      document: {
        description: "updated work description",
        feature_name: "Test Feature",
        feature_tier: "BASIC",
        newField: "new value",
      },
    };

    mockWorkRepository.update.mockResolvedValue(updatedResource);
    mockMapper.mapDataToEntity.mockReturnValue({});
    mockMapper.mapDataToView.mockReturnValue({});

    const result = await service.execute(input);

    expect(mockWorkEntity.update).toHaveBeenCalledWith({
      name: "Updated Work",
      level: 20,
      document: {
        description: "updated work description",
        feature_name: "Test Feature",
        feature_tier: "BASIC",
        newField: "new value",
      },
    });
    expect(mockWorkRepository.update).toHaveBeenCalledWith(
      { field: "id_work", value: mockUUID.id_work },
      entityExport,
    );
    expect(result.status.description).toBe("WORK_UPDATED");
    expect(result.status.code).toBe(200);
  });
});
