import { describe, it, expect, vi, beforeEach } from "vitest";
import { AccountController } from "../../../../../src/modules/account/controllers";

const mockListAccountsService = { execute: vi.fn() };
const mockReadAccountService = { execute: vi.fn() };
const mockCreateAccountService = { execute: vi.fn() };
const mockUpdateAccountService = { execute: vi.fn() };
const mockRemoveAccountService = { execute: vi.fn() };
const mockStatus = { createHttpStatus: vi.fn() };
const mockValidation = { check: vi.fn() };
const mockSession = {
  authorize: vi.fn(),
  verify: vi.fn(),
  remove: vi.fn(),
};

const mockUUID = {
  id_account: "99018dfc-14c7-471f-a035-b0dc4b6cb6d5",
};

describe("AccountController", () => {
  let controller: AccountController;

  beforeEach(() => {
    vi.clearAllMocks();
    controller = new AccountController(
      mockListAccountsService,
      mockReadAccountService,
      mockCreateAccountService,
      mockUpdateAccountService,
      mockRemoveAccountService,
      mockStatus,
      mockValidation,
      mockSession,
    );
  });

  describe("listAccounts", () => {
    it("should list accounts successfully", async () => {
      const input = {
        scopeType: "service",
        requestType: "listAccounts",
        request: {},
        payload: { limit: 10, offset: 0 },
      };

      const serviceResponse = {
        status: { code: 200, description: "COLLECTION_LISTED" },
        output: [{ id_account: mockUUID.id_account, name: "test account" }],
      };

      mockSession.authorize.mockResolvedValue({});
      mockListAccountsService.execute.mockResolvedValue(serviceResponse);
      mockStatus.createHttpStatus.mockReturnValue(serviceResponse.status);

      const result = await controller.listAccounts(input);

      expect(result.status.description).toBe("COLLECTION_LISTED");
      expect(result.status.code).toBe(200);
      expect(result.output).toEqual(serviceResponse.output);
      expect(mockSession.authorize).toHaveBeenCalledWith(input.request, [
        "service",
      ]);
      expect(mockValidation.check).toHaveBeenCalledWith(
        input.requestType,
        input.payload,
      );
      expect(mockListAccountsService.execute).toHaveBeenCalledWith({
        payload: input.payload,
      });
    });
  });

  describe("readAccount", () => {
    it("should read account for service successfully", async () => {
      const input = {
        scopeType: "service",
        requestType: "readAccount",
        request: {},
        payload: {
          select: [{ field: "id_account", value: mockUUID.id_account }],
        },
      };
      const serviceResponse = {
        status: { code: 200, description: "RESOURCE_READ" },
        output: { id_account: mockUUID.id_account, name: "test account" },
      };
      mockSession.authorize.mockResolvedValue({ sub: mockUUID.id_account });
      mockReadAccountService.execute.mockResolvedValue(serviceResponse);
      mockStatus.createHttpStatus.mockReturnValue({
        code: 200,
        description: "RESOURCE_READ",
      });

      const result = await controller.readAccount(input);

      expect(result.status.description).toBe("RESOURCE_READ");
      expect(result.status.code).toBe(200);
      expect(result.output).toEqual(serviceResponse.output);
      expect(mockSession.authorize).toHaveBeenCalledWith(input.request, [
        "service",
      ]);
      expect(mockValidation.check).toHaveBeenCalledWith(input.requestType, {
        select: input.payload.select,
      });
      expect(mockReadAccountService.execute).toHaveBeenCalledWith({
        payload: { select: input.payload.select },
      });
    });

    it("should read own account for non-service successfully", async () => {
      const input = {
        scopeType: "user",
        requestType: "readAccount",
        request: {},
        payload: {},
      };
      const serviceResponse = {
        status: { code: 200, description: "RESOURCE_READ" },
        output: { id_account: mockUUID.id_account, name: "Test User" },
      };
      mockSession.authorize.mockResolvedValue({ sub: mockUUID.id_account });
      mockReadAccountService.execute.mockResolvedValue(serviceResponse);
      mockStatus.createHttpStatus.mockReturnValue({
        code: 200,
        description: "RESOURCE_READ",
      });

      const result = await controller.readAccount(input);

      expect(result.status.description).toBe("RESOURCE_READ");
      expect(result.status.code).toBe(200);
      expect(result.output).toEqual(serviceResponse.output);
      expect(mockSession.authorize).toHaveBeenCalledWith(input.request, [
        "user",
      ]);
      expect(mockValidation.check).toHaveBeenCalledWith(input.requestType, {
        select: [{ field: "id_account", value: mockUUID.id_account }],
      });
      expect(mockReadAccountService.execute).toHaveBeenCalledWith({
        payload: {
          select: [{ field: "id_account", value: mockUUID.id_account }],
        },
      });
    });
  });

  describe("createAccount", () => {
    it("should create account successfully", async () => {
      const input = {
        requestType: "create",
        request: {},
        payload: { email: "test@example.com", password: "password123" },
      };
      const serviceResponse = {
        status: { code: 201, description: "ACCOUNT_CREATED" },
        output: { id_account: mockUUID.id_account, email: "test@example.com" },
      };
      mockSession.verify.mockResolvedValue(null);
      mockCreateAccountService.execute.mockResolvedValue(serviceResponse);
      mockStatus.createHttpStatus.mockReturnValue({
        code: 201,
        description: "ACCOUNT_CREATED",
      });

      const result = await controller.createAccount(input);

      expect(result.status.description).toBe("ACCOUNT_CREATED");
      expect(result.status.code).toBe(201);
      expect(result.output).toEqual(serviceResponse.output);
      expect(mockSession.verify).toHaveBeenCalledWith(input.request);
      expect(mockValidation.check).toHaveBeenCalledWith(
        input.requestType,
        input.payload,
      );
      expect(mockCreateAccountService.execute).toHaveBeenCalledWith({
        payload: input.payload,
      });
    });

    it("should throw error if trying to create account while logged in", async () => {
      const input = {
        requestType: "create",
        request: {},
        payload: { email: "test@example.com", password: "password123" },
      };
      mockSession.verify.mockResolvedValue({ scope: { service: false } });
      mockStatus.createHttpStatus.mockReturnValue({
        code: 403,
        description: "NOT_ALLOWED",
      });

      const result = await controller.createAccount(input);

      expect(result.status.description).toBe("NOT_ALLOWED");
      expect(result.status.code).toBe(403);
    });
  });

  describe("updateAccount", () => {
    it("should update account for service successfully", async () => {
      const input = {
        scopeType: "service",
        requestType: "update",
        request: {},
        payload: {
          account: { field: "id_account", value: mockUUID.id_account },
          input: { email: "new@example.com" },
        },
      };
      const serviceResponse = {
        status: { code: 200, description: "ACCOUNT_UPDATED" },
        output: { id_account: mockUUID.id_account, email: "new@example.com" },
      };
      mockSession.authorize.mockResolvedValue({ sub: mockUUID.id_account });
      mockUpdateAccountService.execute.mockResolvedValue(serviceResponse);
      mockStatus.createHttpStatus.mockReturnValue({
        code: 200,
        description: "ACCOUNT_UPDATED",
      });

      const result = await controller.updateAccount(input);

      expect(result.status.description).toBe("ACCOUNT_UPDATED");
      expect(result.status.code).toBe(200);
      expect(result.output).toEqual(serviceResponse.output);
      expect(mockSession.authorize).toHaveBeenCalledWith(input.request, [
        "service",
      ]);
      expect(mockValidation.check).toHaveBeenCalledWith(
        input.requestType,
        input.payload,
      );
      expect(mockUpdateAccountService.execute).toHaveBeenCalledWith({
        payload: input.payload,
      });
    });

    it("should update own account for non-service successfully", async () => {
      const input = {
        scopeType: "user",
        requestType: "update",
        request: {},
        payload: { input: { email: "new@example.com" } },
      };
      const serviceResponse = {
        status: { code: 200, description: "ACCOUNT_UPDATED" },
        output: { id_account: mockUUID.id_account, email: "new@example.com" },
      };
      mockSession.authorize.mockResolvedValue({ sub: mockUUID.id_account });
      mockUpdateAccountService.execute.mockResolvedValue(serviceResponse);
      mockStatus.createHttpStatus.mockReturnValue({
        code: 200,
        description: "ACCOUNT_UPDATED",
      });

      const result = await controller.updateAccount(input);

      expect(result.status.description).toBe("ACCOUNT_UPDATED");
      expect(result.status.code).toBe(200);
      expect(result.output).toEqual(serviceResponse.output);
      expect(mockSession.authorize).toHaveBeenCalledWith(input.request, [
        "user",
      ]);
      expect(mockValidation.check).toHaveBeenCalledWith(input.requestType, {
        account: { field: "id_account", value: mockUUID.id_account },
        input: input.payload.input,
      });
      expect(mockUpdateAccountService.execute).toHaveBeenCalledWith({
        payload: {
          account: { field: "id_account", value: mockUUID.id_account },
          input: input.payload.input,
        },
      });
    });
  });

  describe("removeAccount", () => {
    it("should remove account for service successfully", async () => {
      const input = {
        scopeType: "service",
        requestType: "remove",
        request: {},
        reply: {},
        payload: {
          account: { field: "id_account", value: mockUUID.id_account },
        },
      };
      const serviceResponse = {
        status: { code: 204, description: "ACCOUNT_REMOVED" },
      };
      mockSession.authorize.mockResolvedValue({ sub: mockUUID.id_account });
      mockRemoveAccountService.execute.mockResolvedValue(serviceResponse);
      mockStatus.createHttpStatus.mockReturnValue({
        code: 204,
        description: "ACCOUNT_REMOVED",
      });

      const result = await controller.removeAccount(input);

      expect(result.status.description).toBe("ACCOUNT_REMOVED");
      expect(result.status.code).toBe(204);
      expect(mockSession.authorize).toHaveBeenCalledWith(input.request, [
        "service",
      ]);
      expect(mockValidation.check).toHaveBeenCalledWith(
        input.requestType,
        input.payload,
      );
      expect(mockRemoveAccountService.execute).toHaveBeenCalledWith({
        payload: input.payload,
      });
      expect(mockSession.remove).not.toHaveBeenCalled();
    });

    it("should remove own account for non-service and remove session", async () => {
      const input = {
        scopeType: "user",
        requestType: "remove",
        request: {},
        reply: {},
        payload: {},
      };
      const serviceResponse = {
        status: { code: 204, description: "ACCOUNT_REMOVED" },
      };
      mockSession.authorize.mockResolvedValue({ sub: mockUUID.id_account });
      mockRemoveAccountService.execute.mockResolvedValue(serviceResponse);
      mockStatus.createHttpStatus.mockReturnValue({
        code: 204,
        description: "ACCOUNT_REMOVED",
      });

      const result = await controller.removeAccount(input);

      expect(result.status.description).toBe("ACCOUNT_REMOVED");
      expect(result.status.code).toBe(204);
      expect(mockSession.authorize).toHaveBeenCalledWith(input.request, [
        "user",
      ]);
      expect(mockValidation.check).toHaveBeenCalledWith(input.requestType, {
        account: { field: "id_account", value: mockUUID.id_account },
      });
      expect(mockRemoveAccountService.execute).toHaveBeenCalledWith({
        payload: {
          account: { field: "id_account", value: mockUUID.id_account },
        },
      });
      expect(mockSession.remove).toHaveBeenCalledWith(input.reply);
    });
  });
});
