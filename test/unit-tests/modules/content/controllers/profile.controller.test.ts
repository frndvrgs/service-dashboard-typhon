import { describe, it, expect, vi, beforeEach } from "vitest";
import { ProfileController } from "../../../../../src/modules/content/controllers";
import { InterfaceException } from "../../../../../src/common/exceptions";

vi.mock("../../../../../src/common/abstracts/base.controller", () => ({
  BaseController: class {
    protected status: any;
    constructor(status: any) {
      this.status = status;
    }
    protected handleErrorToGraphql(err: Error | unknown) {
      if (err instanceof InterfaceException) {
        return {
          status: this.status.createHttpStatus(err.status),
        };
      }
      return {
        status: this.status.createHttpStatus({
          code: 500,
          description: "INTERNAL_SERVER_ERROR",
        }),
      };
    }
  },
}));

const mockListProfilesService = { execute: vi.fn() };
const mockReadProfileService = { execute: vi.fn() };
const mockCreateProfileService = { execute: vi.fn() };
const mockUpdateProfileService = { execute: vi.fn() };
const mockRemoveProfileService = { execute: vi.fn() };
const mockStatus = { createHttpStatus: vi.fn() };
const mockValidation = { check: vi.fn() };
const mockSession = {
  authorize: vi.fn(),
  verify: vi.fn(),
};

const mockUUID = {
  id_account: "99018dfc-14c7-471f-a035-b0dc4b6cb6d5",
  id_profile: "082266b7-2e2f-4c8f-9007-e353f02e8512",
};

describe("ProfileController", () => {
  let controller: ProfileController;

  beforeEach(() => {
    vi.clearAllMocks();
    controller = new ProfileController(
      mockListProfilesService,
      mockReadProfileService,
      mockCreateProfileService,
      mockUpdateProfileService,
      mockRemoveProfileService,
      mockStatus,
      mockValidation,
      mockSession,
    );
  });

  describe("listProfiles", () => {
    it("should list profiles successfully", async () => {
      const input = {
        requestType: "listProfiles",
        payload: { limit: 10, offset: 0 },
      };

      const serviceResponse = {
        status: { code: 200, description: "COLLECTION_LISTED" },
        output: [{ id_profile: mockUUID.id_profile, username: "testuser" }],
      };

      mockListProfilesService.execute.mockResolvedValue(serviceResponse);
      mockStatus.createHttpStatus.mockReturnValue(serviceResponse.status);

      const result = await controller.listProfiles(input);

      expect(result.status.description).toBe("COLLECTION_LISTED");
      expect(result.status.code).toBe(200);
      expect(result.output).toEqual(serviceResponse.output);
      expect(mockValidation.check).toHaveBeenCalledWith(
        input.requestType,
        input.payload,
      );
      expect(mockListProfilesService.execute).toHaveBeenCalledWith({
        payload: input.payload,
      });
    });
  });

  describe("readProfile", () => {
    it("should read profile with select field successfully", async () => {
      const input = {
        requestType: "readProfile",
        request: {},
        payload: {
          select: [{ field: "id_profile", value: mockUUID.id_profile }],
        },
      };
      const serviceResponse = {
        status: { code: 200, description: "RESOURCE_READ" },
        output: { id_profile: mockUUID.id_profile, username: "testuser" },
      };
      mockReadProfileService.execute.mockResolvedValue(serviceResponse);
      mockStatus.createHttpStatus.mockReturnValue({
        code: 200,
        description: "RESOURCE_READ",
      });

      const result = await controller.readProfile(input);

      expect(result.status.description).toBe("RESOURCE_READ");
      expect(result.status.code).toBe(200);
      expect(result.output).toEqual(serviceResponse.output);
      expect(mockValidation.check).toHaveBeenCalledWith(input.requestType, {
        select: input.payload.select,
      });
      expect(mockReadProfileService.execute).toHaveBeenCalledWith({
        payload: { select: input.payload.select },
      });
    });

    it("should read own profile without select field successfully", async () => {
      const input = {
        requestType: "readProfile",
        request: {},
        payload: {},
      };
      const serviceResponse = {
        status: { code: 200, description: "RESOURCE_READ" },
        output: { id_profile: mockUUID.id_profile, username: "testuser" },
      };
      mockSession.verify.mockResolvedValue({ sub: mockUUID.id_account });
      mockReadProfileService.execute.mockResolvedValue(serviceResponse);
      mockStatus.createHttpStatus.mockReturnValue({
        code: 200,
        description: "RESOURCE_READ",
      });

      const result = await controller.readProfile(input);

      expect(result.status.description).toBe("RESOURCE_READ");
      expect(result.status.code).toBe(200);
      expect(result.output).toEqual(serviceResponse.output);
      expect(mockValidation.check).toHaveBeenCalledWith(input.requestType, {
        select: [{ field: "id_account", value: mockUUID.id_account }],
      });
      expect(mockReadProfileService.execute).toHaveBeenCalledWith({
        payload: {
          select: [{ field: "id_account", value: mockUUID.id_account }],
        },
      });
    });

    it("should return an error if not authenticated and no select field", async () => {
      const input = {
        requestType: "readProfile",
        request: {},
        payload: {},
      };
      mockSession.verify.mockResolvedValue(null);
      mockStatus.createHttpStatus.mockReturnValue({
        code: 400,
        description: "INVALID_INPUT",
      });

      const result = await controller.readProfile(input);

      expect(result.status.code).toBe(400);
      expect(result.status.description).toBe("INVALID_INPUT");
      expect(mockSession.verify).toHaveBeenCalledWith(input.request);
      expect(mockReadProfileService.execute).not.toHaveBeenCalled();
    });
  });

  describe("createProfile", () => {
    it("should create profile for service successfully", async () => {
      const input = {
        scopeType: "service",
        requestType: "createProfile",
        request: {},
        payload: {
          account: { field: "id_account", value: mockUUID.id_account },
          input: { username: "newuser", name: "New User" },
        },
      };
      const serviceResponse = {
        status: { code: 201, description: "PROFILE_CREATED" },
        output: {
          id_profile: mockUUID.id_profile,
          username: "newuser",
          name: "New User",
        },
      };
      mockSession.authorize.mockResolvedValue({});
      mockCreateProfileService.execute.mockResolvedValue(serviceResponse);
      mockStatus.createHttpStatus.mockReturnValue({
        code: 201,
        description: "PROFILE_CREATED",
      });

      const result = await controller.createProfile(input);

      expect(result.status.description).toBe("PROFILE_CREATED");
      expect(result.status.code).toBe(201);
      expect(result.output).toEqual(serviceResponse.output);
      expect(mockSession.authorize).toHaveBeenCalledWith(input.request, [
        "service",
      ]);
      expect(mockValidation.check).toHaveBeenCalledWith(
        input.requestType,
        input.payload,
      );
      expect(mockCreateProfileService.execute).toHaveBeenCalledWith({
        payload: input.payload,
      });
    });

    it("should create own profile for non-service successfully", async () => {
      const input = {
        scopeType: "user",
        requestType: "createProfile",
        request: {},
        payload: {
          input: { username: "newuser", name: "New User" },
        },
      };
      const serviceResponse = {
        status: { code: 201, description: "PROFILE_CREATED" },
        output: {
          id_profile: mockUUID.id_profile,
          username: "newuser",
          name: "New User",
        },
      };
      mockSession.authorize.mockResolvedValue({ sub: mockUUID.id_account });
      mockCreateProfileService.execute.mockResolvedValue(serviceResponse);
      mockStatus.createHttpStatus.mockReturnValue({
        code: 201,
        description: "PROFILE_CREATED",
      });

      const result = await controller.createProfile(input);

      expect(result.status.description).toBe("PROFILE_CREATED");
      expect(result.status.code).toBe(201);
      expect(result.output).toEqual(serviceResponse.output);
      expect(mockSession.authorize).toHaveBeenCalledWith(input.request, [
        "user",
      ]);
      expect(mockValidation.check).toHaveBeenCalledWith(input.requestType, {
        account: { field: "id_account", value: mockUUID.id_account },
        input: input.payload.input,
      });
      expect(mockCreateProfileService.execute).toHaveBeenCalledWith({
        payload: {
          account: { field: "id_account", value: mockUUID.id_account },
          input: input.payload.input,
        },
      });
    });
  });

  describe("updateProfile", () => {
    it("should update profile for service successfully", async () => {
      const input = {
        scopeType: "service",
        requestType: "updateProfile",
        request: {},
        payload: {
          account: { field: "id_account", value: mockUUID.id_account },
          input: { name: "Updated User" },
        },
      };
      const serviceResponse = {
        status: { code: 200, description: "PROFILE_UPDATED" },
        output: {
          id_profile: mockUUID.id_profile,
          username: "testuser",
          name: "Updated User",
        },
      };
      mockSession.authorize.mockResolvedValue({});
      mockUpdateProfileService.execute.mockResolvedValue(serviceResponse);
      mockStatus.createHttpStatus.mockReturnValue({
        code: 200,
        description: "PROFILE_UPDATED",
      });

      const result = await controller.updateProfile(input);

      expect(result.status.description).toBe("PROFILE_UPDATED");
      expect(result.status.code).toBe(200);
      expect(result.output).toEqual(serviceResponse.output);
      expect(mockSession.authorize).toHaveBeenCalledWith(input.request, [
        "service",
      ]);
      expect(mockValidation.check).toHaveBeenCalledWith(
        input.requestType,
        input.payload,
      );
      expect(mockUpdateProfileService.execute).toHaveBeenCalledWith({
        payload: input.payload,
      });
    });

    it("should update own profile for non-service successfully", async () => {
      const input = {
        scopeType: "user",
        requestType: "updateProfile",
        request: {},
        payload: {
          input: { name: "Updated User" },
        },
      };
      const serviceResponse = {
        status: { code: 200, description: "PROFILE_UPDATED" },
        output: {
          id_profile: mockUUID.id_profile,
          username: "testuser",
          name: "Updated User",
        },
      };
      mockSession.authorize.mockResolvedValue({ sub: mockUUID.id_account });
      mockUpdateProfileService.execute.mockResolvedValue(serviceResponse);
      mockStatus.createHttpStatus.mockReturnValue({
        code: 200,
        description: "PROFILE_UPDATED",
      });

      const result = await controller.updateProfile(input);

      expect(result.status.description).toBe("PROFILE_UPDATED");
      expect(result.status.code).toBe(200);
      expect(result.output).toEqual(serviceResponse.output);
      expect(mockSession.authorize).toHaveBeenCalledWith(input.request, [
        "user",
      ]);
      expect(mockValidation.check).toHaveBeenCalledWith(input.requestType, {
        account: { field: "id_account", value: mockUUID.id_account },
        input: input.payload.input,
      });
      expect(mockUpdateProfileService.execute).toHaveBeenCalledWith({
        payload: {
          account: { field: "id_account", value: mockUUID.id_account },
          input: input.payload.input,
        },
      });
    });
  });

  describe("removeProfile", () => {
    it("should remove profile for service successfully", async () => {
      const input = {
        scopeType: "service",
        requestType: "removeProfile",
        request: {},
        payload: {
          account: { field: "id_account", value: mockUUID.id_account },
        },
      };
      const serviceResponse = {
        status: { code: 204, description: "PROFILE_REMOVED" },
      };
      mockSession.authorize.mockResolvedValue({});
      mockRemoveProfileService.execute.mockResolvedValue(serviceResponse);
      mockStatus.createHttpStatus.mockReturnValue({
        code: 204,
        description: "PROFILE_REMOVED",
      });

      const result = await controller.removeProfile(input);

      expect(result.status.description).toBe("PROFILE_REMOVED");
      expect(result.status.code).toBe(204);
      expect(mockSession.authorize).toHaveBeenCalledWith(input.request, [
        "service",
      ]);
      expect(mockValidation.check).toHaveBeenCalledWith(
        input.requestType,
        input.payload,
      );
      expect(mockRemoveProfileService.execute).toHaveBeenCalledWith({
        payload: input.payload,
      });
    });

    it("should remove own profile for non-service", async () => {
      const input = {
        scopeType: "user",
        requestType: "removeProfile",
        request: {},
        payload: {},
      };
      const serviceResponse = {
        status: { code: 204, description: "PROFILE_REMOVED" },
      };
      mockSession.authorize.mockResolvedValue({ sub: mockUUID.id_account });
      mockRemoveProfileService.execute.mockResolvedValue(serviceResponse);
      mockStatus.createHttpStatus.mockReturnValue({
        code: 204,
        description: "PROFILE_REMOVED",
      });

      const result = await controller.removeProfile(input);

      expect(result.status.description).toBe("PROFILE_REMOVED");
      expect(result.status.code).toBe(204);
      expect(mockSession.authorize).toHaveBeenCalledWith(input.request, [
        "user",
      ]);
      expect(mockValidation.check).toHaveBeenCalledWith(input.requestType, {
        account: { field: "id_account", value: mockUUID.id_account },
      });
      expect(mockRemoveProfileService.execute).toHaveBeenCalledWith({
        payload: {
          account: { field: "id_account", value: mockUUID.id_account },
        },
      });
    });
  });
});
