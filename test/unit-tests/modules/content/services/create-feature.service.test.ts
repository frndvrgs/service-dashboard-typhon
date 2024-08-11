import { describe, it, expect, vi, beforeEach } from "vitest";
import { CreateFeatureService } from "../../../../../src/modules/content/services";
import { AppException } from "../../../../../src/common/exceptions";
import { FeatureEntity } from "../../../../../src/modules/content/domain/entities";

import type { FeatureModel } from "../../../../../src/modules/content/domain/entities";

const mockFeatureRepository = {
  create: vi.fn(),
};

const mockMapper = {
  mapEntityToData: vi.fn(),
  mapDataToView: vi.fn(),
};

const mockUUID = {
  id_feature: "082266b7-2e2f-4c8f-9007-e353f02e8512",
};

describe("CreateFeatureService", () => {
  let service: CreateFeatureService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new CreateFeatureService(mockFeatureRepository, mockMapper);
    vi.spyOn(FeatureEntity, "create");
  });

  it("should create a feature successfully", async () => {
    const input = {
      payload: {
        input: {
          name: "Test Feature",
          subscription_scope: ["BASIC", "CORPORATE"],
          description: "feature description",
        },
      },
    };

    const entityExport: FeatureModel = {
      id: mockUUID.id_feature,
      createdAt: "2024-08-11T11:57:43.353Z",
      updatedAt: "2024-08-11T11:57:43.353Z",
      name: "Test Feature",
      subscriptionScope: ["BASIC", "CORPORATE"],
      document: { description: "feature description" },
    };

    const mockFeatureEntity = { export: vi.fn().mockReturnValue(entityExport) };
    vi.mocked(FeatureEntity.create).mockReturnValue(
      mockFeatureEntity as unknown as FeatureEntity,
    );

    const resource = {
      id_feature: mockUUID.id_feature,
      name: "Test Feature",
      subscription_scope: ["BASIC", "CORPORATE"],
      document: { description: "feature description" },
    };

    mockFeatureRepository.create.mockResolvedValue(resource);
    mockMapper.mapDataToView.mockReturnValue({});

    const result = await service.execute(input);

    expect(mockFeatureRepository.create).toHaveBeenCalledWith(entityExport);
    expect(mockMapper.mapDataToView).toHaveBeenCalled();
    expect(result.status.description).toBe("FEATURE_CREATED");
    expect(result.status.code).toBe(201);
  });

  it("should throw an exception if feature creation fails", async () => {
    const input = {
      payload: {
        input: {
          name: "Test Feature",
          subscription_scope: ["BASIC"],
        },
      },
    };

    mockFeatureRepository.create.mockResolvedValue(null);

    await expect(service.execute(input)).rejects.toThrow(AppException);
    expect(mockFeatureRepository.create).toHaveBeenCalled();
  });

  it("should create a feature with additional document fields", async () => {
    const input = {
      payload: {
        input: {
          name: "Test Feature",
          subscription_scope: ["CORPORATE"],
          description: "corporate feature description",
          maxUsage: 100,
          isActive: true,
        },
      },
    };

    const entityExport: FeatureModel = {
      id: mockUUID.id_feature,
      createdAt: "2024-08-11T11:57:43.353Z",
      updatedAt: "2024-08-11T11:57:43.353Z",
      name: "Test Feature",
      subscriptionScope: ["CORPORATE"],
      document: {
        description: "corporate feature description",
        maxUsage: 100,
        isActive: true,
      },
    };

    const mockFeatureEntity = { export: vi.fn().mockReturnValue(entityExport) };
    vi.mocked(FeatureEntity.create).mockReturnValue(
      mockFeatureEntity as unknown as FeatureEntity,
    );

    const resource = {
      id_feature: mockUUID.id_feature,
      name: "Test Feature",
      subscription_scope: ["CORPORATE"],
      document: {
        description: "corporate feature description",
        maxUsage: 100,
        isActive: true,
      },
    };

    mockFeatureRepository.create.mockResolvedValue(resource);
    mockMapper.mapDataToView.mockReturnValue({});

    const result = await service.execute(input);

    expect(mockFeatureRepository.create).toHaveBeenCalledWith(entityExport);
    expect(mockMapper.mapDataToView).toHaveBeenCalled();
    expect(result.status.description).toBe("FEATURE_CREATED");
    expect(result.status.code).toBe(201);
  });
});
