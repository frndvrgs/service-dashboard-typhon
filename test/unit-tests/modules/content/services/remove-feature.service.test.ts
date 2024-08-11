import { describe, it, expect, vi, beforeEach } from "vitest";
import { RemoveFeatureService } from "../../../../../src/modules/content/services";
import { AppException } from "../../../../../src/common/exceptions";

const mockFeatureRepository = {
  select: vi.fn(),
  remove: vi.fn(),
};

const mockUUID = {
  id_feature: "082266b7-2e2f-4c8f-9007-e353f02e8512",
  nonexistent: "e34e572f-724a-45c6-b9e9-f2985cd3b0b2",
};

describe("RemoveFeatureService", () => {
  let service: RemoveFeatureService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new RemoveFeatureService(mockFeatureRepository);
  });

  it("should remove a feature successfully", async () => {
    const input = {
      payload: {
        feature: { field: "id_feature", value: mockUUID.id_feature },
      },
    };

    const originalResource = {
      id_feature: mockUUID.id_feature,
      name: "Test Feature",
      subscription_scope: ["BASIC", "CORPORATE"],
      document: { description: "feature description" },
    };

    mockFeatureRepository.select.mockResolvedValue(originalResource);
    mockFeatureRepository.remove.mockResolvedValue(true);

    const result = await service.execute(input);

    expect(mockFeatureRepository.select).toHaveBeenCalledWith({
      field: "id_feature",
      value: mockUUID.id_feature,
    });
    expect(mockFeatureRepository.remove).toHaveBeenCalledWith({
      field: "id_feature",
      value: mockUUID.id_feature,
    });
    expect(result.status.description).toBe("FEATURE_REMOVED");
    expect(result.status.code).toBe(204);
  });

  it("should throw an exception if feature is not provided", async () => {
    const input = {
      payload: {},
    };

    await expect(service.execute(input)).rejects.toThrow(AppException);
    expect(mockFeatureRepository.select).not.toHaveBeenCalled();
    expect(mockFeatureRepository.remove).not.toHaveBeenCalled();
  });

  it("should throw an exception if feature does not exist", async () => {
    const input = {
      payload: {
        feature: { field: "id_feature", value: mockUUID.nonexistent },
      },
    };

    mockFeatureRepository.select.mockResolvedValue(null);

    await expect(service.execute(input)).rejects.toThrow(AppException);
    expect(mockFeatureRepository.select).toHaveBeenCalledWith({
      field: "id_feature",
      value: mockUUID.nonexistent,
    });
    expect(mockFeatureRepository.remove).not.toHaveBeenCalled();
  });

  it("should throw an exception if feature removal fails", async () => {
    const input = {
      payload: {
        feature: { field: "id_feature", value: mockUUID.id_feature },
      },
    };

    const originalResource = {
      id_feature: mockUUID.id_feature,
      name: "Test Feature",
      subscription_scope: ["BASIC", "CORPORATE"],
      document: { description: "feature description" },
    };

    mockFeatureRepository.select.mockResolvedValue(originalResource);
    mockFeatureRepository.remove.mockResolvedValue(false);

    await expect(service.execute(input)).rejects.toThrow(AppException);
    expect(mockFeatureRepository.select).toHaveBeenCalled();
    expect(mockFeatureRepository.remove).toHaveBeenCalled();
  });
});
