import { describe, it, expect, vi, beforeEach } from "vitest";
import { SubscriptionController } from "../../../../../src/modules/account/controllers";

const mockListSubscriptionsService = { execute: vi.fn() };
const mockReadSubscriptionService = { execute: vi.fn() };
const mockCreateSubscriptionService = { execute: vi.fn() };
const mockUpdateSubscriptionService = { execute: vi.fn() };
const mockRemoveSubscriptionService = { execute: vi.fn() };
const mockStatus = { createHttpStatus: vi.fn() };
const mockValidation = { check: vi.fn() };
const mockSession = {
  authorize: vi.fn(),
};

const mockUUID = {
  id_account: "99018dfc-14c7-471f-a035-b0dc4b6cb6d5",
  id_subscription: "082266b7-2e2f-4c8f-9007-e353f02e8512",
};

describe("SubscriptionController", () => {
  let controller: SubscriptionController;

  beforeEach(() => {
    vi.clearAllMocks();
    controller = new SubscriptionController(
      mockListSubscriptionsService,
      mockReadSubscriptionService,
      mockCreateSubscriptionService,
      mockUpdateSubscriptionService,
      mockRemoveSubscriptionService,
      mockStatus,
      mockValidation,
      mockSession,
    );
  });

  describe("listSubscriptions", () => {
    it("should list subscriptions successfully", async () => {
      const input = {
        scopeType: "service",
        requestType: "listSubscriptions",
        request: {},
        payload: { limit: 10, offset: 0 },
      };

      const serviceResponse = {
        status: { code: 200, description: "COLLECTION_LISTED" },
        output: [{ id_subscription: mockUUID.id_subscription, type: "FREE" }],
      };

      mockSession.authorize.mockResolvedValue({});
      mockListSubscriptionsService.execute.mockResolvedValue(serviceResponse);
      mockStatus.createHttpStatus.mockReturnValue(serviceResponse.status);

      const result = await controller.listSubscriptions(input);

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
      expect(mockListSubscriptionsService.execute).toHaveBeenCalledWith({
        payload: input.payload,
      });
    });
  });

  describe("readSubscription", () => {
    it("should read subscription for service successfully", async () => {
      const input = {
        scopeType: "service",
        requestType: "readSubscription",
        request: {},
        payload: {
          select: [
            { field: "id_subscription", value: mockUUID.id_subscription },
          ],
        },
      };
      const serviceResponse = {
        status: { code: 200, description: "RESOURCE_READ" },
        output: { id_subscription: mockUUID.id_subscription, type: "FREE" },
      };
      mockSession.authorize.mockResolvedValue({ sub: mockUUID.id_account });
      mockReadSubscriptionService.execute.mockResolvedValue(serviceResponse);
      mockStatus.createHttpStatus.mockReturnValue({
        code: 200,
        description: "RESOURCE_READ",
      });

      const result = await controller.readSubscription(input);

      expect(result.status.description).toBe("RESOURCE_READ");
      expect(result.status.code).toBe(200);
      expect(result.output).toEqual(serviceResponse.output);
      expect(mockSession.authorize).toHaveBeenCalledWith(input.request, [
        "service",
      ]);
      expect(mockValidation.check).toHaveBeenCalledWith(input.requestType, {
        select: input.payload.select,
      });
      expect(mockReadSubscriptionService.execute).toHaveBeenCalledWith({
        payload: { select: input.payload.select },
      });
    });

    it("should read own subscription for non-service successfully", async () => {
      const input = {
        scopeType: "user",
        requestType: "readSubscription",
        request: {},
        payload: {},
      };
      const serviceResponse = {
        status: { code: 200, description: "RESOURCE_READ" },
        output: { id_subscription: mockUUID.id_subscription, type: "FREE" },
      };
      mockSession.authorize.mockResolvedValue({ sub: mockUUID.id_account });
      mockReadSubscriptionService.execute.mockResolvedValue(serviceResponse);
      mockStatus.createHttpStatus.mockReturnValue({
        code: 200,
        description: "RESOURCE_READ",
      });

      const result = await controller.readSubscription(input);

      expect(result.status.description).toBe("RESOURCE_READ");
      expect(result.status.code).toBe(200);
      expect(result.output).toEqual(serviceResponse.output);
      expect(mockSession.authorize).toHaveBeenCalledWith(input.request, [
        "user",
      ]);
      expect(mockValidation.check).toHaveBeenCalledWith(input.requestType, {
        select: [{ field: "id_account", value: mockUUID.id_account }],
      });
      expect(mockReadSubscriptionService.execute).toHaveBeenCalledWith({
        payload: {
          select: [{ field: "id_account", value: mockUUID.id_account }],
        },
      });
    });
  });

  describe("createSubscription", () => {
    it("should create subscription successfully", async () => {
      const input = {
        scopeType: "service",
        requestType: "createSubscription",
        request: {},
        payload: {
          account: { field: "id_account", value: mockUUID.id_account },
          input: { type: "FREE", status: "ACTIVE" },
        },
      };
      const serviceResponse = {
        status: { code: 201, description: "ACCOUNT_CREATED" },
        output: {
          id_subscription: mockUUID.id_subscription,
          type: "FREE",
          status: "ACTIVE",
        },
      };
      mockSession.authorize.mockResolvedValue({});
      mockCreateSubscriptionService.execute.mockResolvedValue(serviceResponse);
      mockStatus.createHttpStatus.mockReturnValue({
        code: 201,
        description: "ACCOUNT_CREATED",
      });

      const result = await controller.createSubscription(input);

      expect(result.status.description).toBe("ACCOUNT_CREATED");
      expect(result.status.code).toBe(201);
      expect(result.output).toEqual(serviceResponse.output);
      expect(mockSession.authorize).toHaveBeenCalledWith(input.request, [
        "service",
      ]);
      expect(mockValidation.check).toHaveBeenCalledWith(
        input.requestType,
        input.payload,
      );
      expect(mockCreateSubscriptionService.execute).toHaveBeenCalledWith({
        payload: input.payload,
      });
    });
  });

  describe("updateSubscription", () => {
    it("should update subscription successfully", async () => {
      const input = {
        scopeType: "service",
        requestType: "updateSubscription",
        request: {},
        payload: {
          subscription: {
            field: "id_subscription",
            value: mockUUID.id_subscription,
          },
          input: { type: "PREMIUM", status: "ACTIVE" },
        },
      };
      const serviceResponse = {
        status: { code: 200, description: "SUBSCRIPTION_UPDATED" },
        output: {
          id_subscription: mockUUID.id_subscription,
          type: "PREMIUM",
          status: "ACTIVE",
        },
      };
      mockSession.authorize.mockResolvedValue({});
      mockUpdateSubscriptionService.execute.mockResolvedValue(serviceResponse);
      mockStatus.createHttpStatus.mockReturnValue({
        code: 200,
        description: "SUBSCRIPTION_UPDATED",
      });

      const result = await controller.updateSubscription(input);

      expect(result.status.description).toBe("SUBSCRIPTION_UPDATED");
      expect(result.status.code).toBe(200);
      expect(result.output).toEqual(serviceResponse.output);
      expect(mockSession.authorize).toHaveBeenCalledWith(input.request, [
        "service",
      ]);
      expect(mockValidation.check).toHaveBeenCalledWith(
        input.requestType,
        input.payload,
      );
      expect(mockUpdateSubscriptionService.execute).toHaveBeenCalledWith({
        payload: input.payload,
      });
    });
  });

  describe("removeSubscription", () => {
    it("should remove subscription for service successfully", async () => {
      const input = {
        scopeType: "service",
        requestType: "removeSubscription",
        request: {},
        payload: {
          subscription: {
            field: "id_subscription",
            value: mockUUID.id_subscription,
          },
        },
      };
      const serviceResponse = {
        status: { code: 204, description: "SUBSCRIPTION_REMOVED" },
      };
      mockSession.authorize.mockResolvedValue({});
      mockRemoveSubscriptionService.execute.mockResolvedValue(serviceResponse);
      mockStatus.createHttpStatus.mockReturnValue({
        code: 204,
        description: "SUBSCRIPTION_REMOVED",
      });

      const result = await controller.removeSubscription(input);

      expect(result.status.description).toBe("SUBSCRIPTION_REMOVED");
      expect(result.status.code).toBe(204);
      expect(mockSession.authorize).toHaveBeenCalledWith(input.request, [
        "service",
      ]);
      expect(mockValidation.check).toHaveBeenCalledWith(
        input.requestType,
        input.payload,
      );
      expect(mockRemoveSubscriptionService.execute).toHaveBeenCalledWith({
        payload: input.payload,
      });
    });

    it("should remove own subscription for non-service", async () => {
      const input = {
        scopeType: "user",
        requestType: "removeSubscription",
        request: {},
        payload: {},
      };
      const serviceResponse = {
        status: { code: 204, description: "SUBSCRIPTION_REMOVED" },
      };
      mockSession.authorize.mockResolvedValue({ sub: mockUUID.id_account });
      mockRemoveSubscriptionService.execute.mockResolvedValue(serviceResponse);
      mockStatus.createHttpStatus.mockReturnValue({
        code: 204,
        description: "SUBSCRIPTION_REMOVED",
      });

      const result = await controller.removeSubscription(input);

      expect(result.status.description).toBe("SUBSCRIPTION_REMOVED");
      expect(result.status.code).toBe(204);
      expect(mockSession.authorize).toHaveBeenCalledWith(input.request, [
        "user",
      ]);
      expect(mockValidation.check).toHaveBeenCalledWith(input.requestType, {
        subscription: { field: "id_account", value: mockUUID.id_account },
      });
      expect(mockRemoveSubscriptionService.execute).toHaveBeenCalledWith({
        payload: {
          subscription: { field: "id_account", value: mockUUID.id_account },
        },
      });
    });
  });
});
