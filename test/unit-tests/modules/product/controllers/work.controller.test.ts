import { describe, it, expect, vi, beforeEach } from "vitest";
import { WorkController } from "../../../../../src/modules/product/controllers";
import { InterfaceException } from "../../../../../src/common/exceptions";

const mockListWorksService = { execute: vi.fn() };
const mockReadWorkService = { execute: vi.fn() };
const mockCreateWorkService = { execute: vi.fn() };
const mockUpdateWorkService = { execute: vi.fn() };
const mockRemoveWorkService = { execute: vi.fn() };
const mockStatus = { createHttpStatus: vi.fn() };
const mockValidation = { check: vi.fn() };
const mockSession = {
  authorize: vi.fn(),
  verify: vi.fn(),
};

const mockUUID = {
  id_account: "99018dfc-14c7-471f-a035-b0dc4b6cb6d5",
  id_work: "082266b7-2e2f-4c8f-9007-e353f02e8512",
};

describe("WorkController", () => {
  let controller: WorkController;

  beforeEach(() => {
    vi.clearAllMocks();
    controller = new WorkController(
      mockListWorksService,
      mockReadWorkService,
      mockCreateWorkService,
      mockUpdateWorkService,
      mockRemoveWorkService,
      mockStatus,
      mockValidation,
      mockSession,
    );
  });

  describe("listWorks", () => {
    it("should list works successfully", async () => {
      const input = {
        scopeType: "service",
        requestType: "listWorks",
        request: {},
        payload: { limit: 10, offset: 0 },
      };

      const serviceResponse = {
        status: { code: 200, description: "COLLECTION_LISTED" },
        output: [{ id_work: mockUUID.id_work, title: "Test Work" }],
      };

      mockListWorksService.execute.mockResolvedValue(serviceResponse);
      mockStatus.createHttpStatus.mockReturnValue(serviceResponse.status);

      const result = await controller.listWorks(input);

      expect(result.status.description).toBe("COLLECTION_LISTED");
      expect(result.status.code).toBe(200);
      expect(result.output).toEqual(serviceResponse.output);
      expect(mockValidation.check).toHaveBeenCalledWith(
        input.requestType,
        input.payload,
      );
      expect(mockListWorksService.execute).toHaveBeenCalledWith({
        payload: input.payload,
      });
    });
  });

  describe("readWork", () => {
    it("should read work with select field successfully", async () => {
      const input = {
        scopeType: "service",
        requestType: "readWork",
        request: {},
        payload: { select: [{ field: "id_work", value: mockUUID.id_work }] },
      };
      const serviceResponse = {
        status: { code: 200, description: "RESOURCE_READ" },
        output: { id_work: mockUUID.id_work, title: "Test Work" },
      };
      mockReadWorkService.execute.mockResolvedValue(serviceResponse);
      mockStatus.createHttpStatus.mockReturnValue({
        code: 200,
        description: "RESOURCE_READ",
      });

      const result = await controller.readWork(input);

      expect(result.status.description).toBe("RESOURCE_READ");
      expect(result.status.code).toBe(200);
      expect(result.output).toEqual(serviceResponse.output);
      expect(mockValidation.check).toHaveBeenCalledWith(input.requestType, {
        select: input.payload.select,
      });
      expect(mockReadWorkService.execute).toHaveBeenCalledWith({
        payload: { select: input.payload.select },
      });
    });
  });

  describe("createWork", () => {
    it("should create work for service successfully", async () => {
      const input = {
        scopeType: "service",
        requestType: "createWork",
        request: {},
        payload: {
          account: { field: "id_account", value: mockUUID.id_account },
          feature: "123",
          input: { title: "New Work", description: "New work description" },
        },
      };
      const serviceResponse = {
        status: { code: 201, description: "WORK_CREATED" },
        output: {
          id_work: mockUUID.id_work,
          title: "New Work",
          description: "New work description",
        },
      };
      mockSession.authorize.mockResolvedValue({});
      mockCreateWorkService.execute.mockResolvedValue(serviceResponse);
      mockStatus.createHttpStatus.mockReturnValue({
        code: 201,
        description: "WORK_CREATED",
      });

      const result = await controller.createWork(input);

      expect(result.status.description).toBe("WORK_CREATED");
      expect(result.status.code).toBe(201);
      expect(result.output).toEqual(serviceResponse.output);
      expect(mockSession.authorize).toHaveBeenCalledWith(input.request, [
        "service",
      ]);
      expect(mockValidation.check).toHaveBeenCalledWith(
        input.requestType,
        input.payload,
      );
      expect(mockCreateWorkService.execute).toHaveBeenCalledWith({
        payload: input.payload,
      });
    });

    it("should create own work for non-service successfully", async () => {
      const input = {
        scopeType: "user",
        requestType: "createWork",
        request: {},
        payload: {
          feature: "123",
          input: { title: "New Work", description: "New work description" },
        },
      };
      const serviceResponse = {
        status: { code: 201, description: "WORK_CREATED" },
        output: {
          id_work: mockUUID.id_work,
          title: "New Work",
          description: "New work description",
        },
      };
      mockSession.authorize.mockResolvedValue({ sub: mockUUID.id_account });
      mockCreateWorkService.execute.mockResolvedValue(serviceResponse);
      mockStatus.createHttpStatus.mockReturnValue({
        code: 201,
        description: "WORK_CREATED",
      });

      const result = await controller.createWork(input);

      expect(result.status.description).toBe("WORK_CREATED");
      expect(result.status.code).toBe(201);
      expect(result.output).toEqual(serviceResponse.output);
      expect(mockSession.authorize).toHaveBeenCalledWith(input.request, [
        "user",
      ]);
      expect(mockValidation.check).toHaveBeenCalledWith(input.requestType, {
        account: { field: "id_account", value: mockUUID.id_account },
        feature: input.payload.feature,
        input: input.payload.input,
      });
      expect(mockCreateWorkService.execute).toHaveBeenCalledWith({
        payload: {
          account: { field: "id_account", value: mockUUID.id_account },
          feature: input.payload.feature,
          input: input.payload.input,
        },
      });
    });
  });

  describe("updateWork", () => {
    it("should update work for service successfully", async () => {
      const input = {
        scopeType: "service",
        requestType: "updateWork",
        request: {},
        payload: {
          account: { field: "id_account", value: mockUUID.id_account },
          work: { field: "id_work", value: mockUUID.id_work },
          input: { title: "Updated Work" },
        },
      };
      const serviceResponse = {
        status: { code: 200, description: "WORK_UPDATED" },
        output: {
          id_work: mockUUID.id_work,
          title: "Updated Work",
          description: "New work description",
        },
      };
      mockSession.authorize.mockResolvedValue({});
      mockUpdateWorkService.execute.mockResolvedValue(serviceResponse);
      mockStatus.createHttpStatus.mockReturnValue({
        code: 200,
        description: "WORK_UPDATED",
      });

      const result = await controller.updateWork(input);

      expect(result.status.description).toBe("WORK_UPDATED");
      expect(result.status.code).toBe(200);
      expect(result.output).toEqual(serviceResponse.output);
      expect(mockSession.authorize).toHaveBeenCalledWith(input.request, [
        "service",
      ]);
      expect(mockValidation.check).toHaveBeenCalledWith(
        input.requestType,
        input.payload,
      );
      expect(mockUpdateWorkService.execute).toHaveBeenCalledWith({
        payload: input.payload,
      });
    });

    it("should update own work for non-service successfully", async () => {
      const input = {
        scopeType: "user",
        requestType: "updateWork",
        request: {},
        payload: {
          work: { field: "id_work", value: mockUUID.id_work },
          input: { title: "Updated Work" },
        },
      };
      const serviceResponse = {
        status: { code: 200, description: "WORK_UPDATED" },
        output: {
          id_work: mockUUID.id_work,
          title: "Updated Work",
          description: "New work description",
        },
      };
      mockSession.authorize.mockResolvedValue({ sub: mockUUID.id_account });
      mockUpdateWorkService.execute.mockResolvedValue(serviceResponse);
      mockStatus.createHttpStatus.mockReturnValue({
        code: 200,
        description: "WORK_UPDATED",
      });

      const result = await controller.updateWork(input);

      expect(result.status.description).toBe("WORK_UPDATED");
      expect(result.status.code).toBe(200);
      expect(result.output).toEqual(serviceResponse.output);
      expect(mockSession.authorize).toHaveBeenCalledWith(input.request, [
        "user",
      ]);
      expect(mockValidation.check).toHaveBeenCalledWith(input.requestType, {
        account: { field: "id_account", value: mockUUID.id_account },
        work: input.payload.work,
        input: input.payload.input,
      });
      expect(mockUpdateWorkService.execute).toHaveBeenCalledWith({
        payload: {
          account: { field: "id_account", value: mockUUID.id_account },
          work: input.payload.work,
          input: input.payload.input,
        },
      });
    });
  });

  describe("removeWork", () => {
    it("should remove work for service successfully", async () => {
      const input = {
        scopeType: "service",
        requestType: "removeWork",
        request: {},
        payload: {
          account: { field: "id_account", value: mockUUID.id_account },
          work: { field: "id_work", value: mockUUID.id_work },
        },
      };
      const serviceResponse = {
        status: { code: 204, description: "WORK_REMOVED" },
      };
      mockSession.authorize.mockResolvedValue({});
      mockRemoveWorkService.execute.mockResolvedValue(serviceResponse);
      mockStatus.createHttpStatus.mockReturnValue({
        code: 204,
        description: "WORK_REMOVED",
      });

      const result = await controller.removeWork(input);

      expect(result.status.description).toBe("WORK_REMOVED");
      expect(result.status.code).toBe(204);
      expect(mockSession.authorize).toHaveBeenCalledWith(input.request, [
        "service",
      ]);
      expect(mockValidation.check).toHaveBeenCalledWith(
        input.requestType,
        input.payload,
      );
      expect(mockRemoveWorkService.execute).toHaveBeenCalledWith({
        payload: input.payload,
      });
    });

    it("should remove own work for non-service", async () => {
      const input = {
        scopeType: "user",
        requestType: "removeWork",
        request: {},
        payload: {
          work: { field: "id_work", value: mockUUID.id_work },
        },
      };
      const serviceResponse = {
        status: { code: 204, description: "WORK_REMOVED" },
      };
      mockSession.authorize.mockResolvedValue({ sub: mockUUID.id_account });
      mockRemoveWorkService.execute.mockResolvedValue(serviceResponse);
      mockStatus.createHttpStatus.mockReturnValue({
        code: 204,
        description: "WORK_REMOVED",
      });

      const result = await controller.removeWork(input);

      expect(result.status.description).toBe("WORK_REMOVED");
      expect(result.status.code).toBe(204);
      expect(mockSession.authorize).toHaveBeenCalledWith(input.request, [
        "user",
      ]);
      expect(mockValidation.check).toHaveBeenCalledWith(input.requestType, {
        account: { field: "id_account", value: mockUUID.id_account },
        work: input.payload.work,
      });
      expect(mockRemoveWorkService.execute).toHaveBeenCalledWith({
        payload: {
          account: { field: "id_account", value: mockUUID.id_account },
          work: input.payload.work,
        },
      });
    });
  });
});
