import { describe, it, expect, vi, beforeEach } from "vitest";
import { UpdateFeatureService } from "../../../../../src/modules/content/services";
import { AppException } from "../../../../../src/common/exceptions";
import { FeatureEntity } from "../../../../../src/modules/content/domain/entities";

import type { FeatureModel } from "../../../../../src/modules/content/domain/entities";

const mockFeatureRepository = {
  select: vi.fn(),
  update: vi.fn(),
};

const mockMapper = {
  mapDataToEntity: vi.fn(),
  mapDataToView: vi.fn(),
};

const mockUUID = {
  id_feature: "082266b7-2e2f-4c8f-9007-e353f02e8512",
};

describe("UpdateFeatureService", () => {
  let service: UpdateFeatureService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new UpdateFeatureService(mockFeatureRepository, mockMapper);
    vi.spyOn(FeatureEntity, "import");
  });

  it("should update a feature successfully", async () => {
    const input = {
      payload: {
        feature: { field: "id_feature", value: mockUUID.id_feature },
        input: {
          name: "Updated Feature",
          subscription_scope: ["CORPORATE"],
          description: "updated feature description",
          newField: "new value",
        },
      },
    };

    const originalResource = {
      id_feature: mockUUID.id_feature,
      name: "Original Feature",
      subscription_scope: ["BASIC"],
      document: { description: "original description" },
    };

    const entityExport: FeatureModel = {
      id: mockUUID.id_feature,
      createdAt: "2024-08-11T11:57:43.353Z",
      updatedAt: "2024-08-12T10:30:00.000Z",
      name: "Updated Feature",
      subscriptionScope: ["CORPORATE"],
      document: {
        description: "updated feature description",
        newField: "new value",
      },
    };

    mockFeatureRepository.select.mockResolvedValue(originalResource);

    const mockFeatureEntity = {
      update: vi.fn(),
      export: vi.fn().mockReturnValue(entityExport),
    };
    vi.mocked(FeatureEntity.import).mockReturnValue(
      mockFeatureEntity as unknown as FeatureEntity,
    );

    const updatedResource = {
      id_feature: mockUUID.id_feature,
      name: "Updated Feature",
      subscription_scope: ["CORPORATE"],
      document: {
        description: "updated feature description",
        newField: "new value",
      },
    };

    mockFeatureRepository.update.mockResolvedValue(updatedResource);
    mockMapper.mapDataToEntity.mockReturnValue({});
    mockMapper.mapDataToView.mockReturnValue({});

    const result = await service.execute(input);

    expect(mockFeatureRepository.select).toHaveBeenCalledWith({
      field: "id_feature",
      value: mockUUID.id_feature,
    });
    expect(FeatureEntity.import).toHaveBeenCalled();
    expect(mockFeatureEntity.update).toHaveBeenCalledWith({
      name: "Updated Feature",
      subscriptionScope: ["CORPORATE"],
      document: {
        description: "updated feature description",
        newField: "new value",
      },
    });
    expect(mockFeatureRepository.update).toHaveBeenCalledWith(
      { field: "id_feature", value: mockUUID.id_feature },
      entityExport,
    );
    expect(mockMapper.mapDataToView).toHaveBeenCalled();
    expect(result.status.description).toBe("FEATURE_UPDATED");
    expect(result.status.code).toBe(200);
  });

  it("should throw an exception if feature is not provided", async () => {
    const input = {
      payload: {
        input: {
          name: "Updated Feature",
          subscription_scope: ["CORPORATE"],
        },
      },
    };

    await expect(service.execute(input)).rejects.toThrow(AppException);
  });

  it("should throw an exception if feature is not found", async () => {
    const input = {
      payload: {
        feature: { field: "id_feature", value: mockUUID.id_feature },
        input: {
          name: "Updated Feature",
          subscription_scope: ["CORPORATE"],
        },
      },
    };

    mockFeatureRepository.select.mockResolvedValue(null);

    await expect(service.execute(input)).rejects.toThrow(AppException);
    expect(mockFeatureRepository.select).toHaveBeenCalledWith({
      field: "id_feature",
      value: mockUUID.id_feature,
    });
  });

  it("should throw an exception if feature update fails", async () => {
    const input = {
      payload: {
        feature: { field: "id_feature", value: mockUUID.id_feature },
        input: {
          name: "Updated Feature",
          subscription_scope: ["CORPORATE"],
        },
      },
    };

    mockFeatureRepository.select.mockResolvedValue({});

    const mockFeatureEntity = {
      update: vi.fn(),
      export: vi.fn().mockReturnValue({}),
    };
    vi.mocked(FeatureEntity.import).mockReturnValue(
      mockFeatureEntity as unknown as FeatureEntity,
    );

    mockFeatureRepository.update.mockResolvedValue(null);

    await expect(service.execute(input)).rejects.toThrow(AppException);
    expect(mockFeatureRepository.update).toHaveBeenCalled();
  });
});
