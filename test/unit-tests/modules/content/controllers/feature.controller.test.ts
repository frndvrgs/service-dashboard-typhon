import { describe, it, expect, vi, beforeEach } from "vitest";
import { FeatureController } from "../../../../../src/modules/content/controllers";

const mockListFeaturesService = { execute: vi.fn() };
const mockCreateFeatureService = { execute: vi.fn() };
const mockUpdateFeatureService = { execute: vi.fn() };
const mockRemoveFeatureService = { execute: vi.fn() };
const mockStatus = { createHttpStatus: vi.fn() };
const mockValidation = { check: vi.fn() };
const mockSession = { authorize: vi.fn() };

const mockUUID = {
  id_feature: "082266b7-2e2f-4c8f-9007-e353f02e8512",
};

describe("FeatureController", () => {
  let controller: FeatureController;

  beforeEach(() => {
    vi.clearAllMocks();
    controller = new FeatureController(
      mockListFeaturesService,
      mockCreateFeatureService,
      mockUpdateFeatureService,
      mockRemoveFeatureService,
      mockStatus,
      mockValidation,
      mockSession,
    );
  });

  describe("listFeatures", () => {
    it("should list features successfully", async () => {
      const input = {
        requestType: "listFeatures",
        payload: { limit: 10, offset: 0 },
      };

      const serviceResponse = {
        status: { code: 200, description: "COLLECTION_LISTED" },
        output: [{ id_feature: mockUUID.id_feature, name: "Feature 1" }],
      };

      mockListFeaturesService.execute.mockResolvedValue(serviceResponse);
      mockStatus.createHttpStatus.mockReturnValue(serviceResponse.status);

      const result = await controller.listFeatures(input);

      expect(result.status.description).toBe("COLLECTION_LISTED");
      expect(result.status.code).toBe(200);
      expect(result.output).toEqual(serviceResponse.output);
      expect(mockValidation.check).toHaveBeenCalledWith(
        input.requestType,
        input.payload,
      );
      expect(mockListFeaturesService.execute).toHaveBeenCalledWith({
        payload: input.payload,
      });
    });
  });

  describe("createFeature", () => {
    it("should create feature successfully", async () => {
      const input = {
        scopeType: "service",
        requestType: "createFeature",
        request: {},
        payload: { name: "New Feature" },
      };
      const serviceResponse = {
        status: { code: 201, description: "FEATURE_CREATED" },
        output: { id_feature: mockUUID.id_feature, name: "New Feature" },
      };
      mockSession.authorize.mockResolvedValue({});
      mockCreateFeatureService.execute.mockResolvedValue(serviceResponse);
      mockStatus.createHttpStatus.mockReturnValue({
        code: 201,
        description: "FEATURE_CREATED",
      });

      const result = await controller.createFeature(input);

      expect(result.status.description).toBe("FEATURE_CREATED");
      expect(result.status.code).toBe(201);
      expect(result.output).toEqual(serviceResponse.output);
      expect(mockSession.authorize).toHaveBeenCalledWith(input.request, [
        "service",
      ]);
      expect(mockValidation.check).toHaveBeenCalledWith(
        input.requestType,
        input.payload,
      );
      expect(mockCreateFeatureService.execute).toHaveBeenCalledWith({
        payload: input.payload,
      });
    });
  });

  describe("updateFeature", () => {
    it("should update feature successfully", async () => {
      const input = {
        scopeType: "service",
        requestType: "updateFeature",
        request: {},
        payload: { id_feature: mockUUID.id_feature, name: "Updated Feature" },
      };
      const serviceResponse = {
        status: { code: 200, description: "FEATURE_UPDATED" },
        output: { id_feature: mockUUID.id_feature, name: "Updated Feature" },
      };
      mockSession.authorize.mockResolvedValue({});
      mockUpdateFeatureService.execute.mockResolvedValue(serviceResponse);
      mockStatus.createHttpStatus.mockReturnValue({
        code: 200,
        description: "FEATURE_UPDATED",
      });

      const result = await controller.updateFeature(input);

      expect(result.status.description).toBe("FEATURE_UPDATED");
      expect(result.status.code).toBe(200);
      expect(result.output).toEqual(serviceResponse.output);
      expect(mockSession.authorize).toHaveBeenCalledWith(input.request, [
        "service",
      ]);
      expect(mockValidation.check).toHaveBeenCalledWith(
        input.requestType,
        input.payload,
      );
      expect(mockUpdateFeatureService.execute).toHaveBeenCalledWith({
        payload: input.payload,
      });
    });
  });

  describe("removeFeature", () => {
    it("should remove feature successfully", async () => {
      const input = {
        scopeType: "service",
        requestType: "removeFeature",
        request: {},
        payload: { id_feature: mockUUID.id_feature },
      };
      const serviceResponse = {
        status: { code: 204, description: "FEATURE_REMOVED" },
      };
      mockSession.authorize.mockResolvedValue({});
      mockRemoveFeatureService.execute.mockResolvedValue(serviceResponse);
      mockStatus.createHttpStatus.mockReturnValue({
        code: 204,
        description: "FEATURE_REMOVED",
      });

      const result = await controller.removeFeature(input);

      expect(result.status.description).toBe("FEATURE_REMOVED");
      expect(result.status.code).toBe(204);
      expect(mockSession.authorize).toHaveBeenCalledWith(input.request, [
        "service",
      ]);
      expect(mockValidation.check).toHaveBeenCalledWith(
        input.requestType,
        input.payload,
      );
      expect(mockRemoveFeatureService.execute).toHaveBeenCalledWith({
        payload: input.payload,
      });
    });
  });
});
