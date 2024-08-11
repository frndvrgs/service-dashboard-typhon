import { describe, it, expect, vi, beforeEach } from "vitest";
import { RemoveSubscriptionService } from "../../../../../src/modules/account/services";
import { AppException } from "../../../../../src/common/exceptions";

const mockSubscriptionRepository = {
  select: vi.fn(),
  remove: vi.fn(),
};

const mockUUID = {
  id_account: "082266b7-2e2f-4c8f-9007-e353f02e8512",
  id_subscription: "e34e572f-724a-45c6-b9e9-f2985cd3b0b2",
};

describe("RemoveSubscriptionService", () => {
  let service: RemoveSubscriptionService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new RemoveSubscriptionService(mockSubscriptionRepository);
  });

  it("should remove a subscription successfully", async () => {
    const input = {
      payload: {
        subscription: {
          field: "id_subscription",
          value: mockUUID.id_subscription,
        },
      },
    };

    const originalResource = {
      id_subscription: mockUUID.id_subscription,
      id_account: mockUUID.id_account,
      type: "FREE",
      status: "ACTIVE",
    };

    mockSubscriptionRepository.select.mockResolvedValue(originalResource);
    mockSubscriptionRepository.remove.mockResolvedValue(true);

    const result = await service.execute(input);

    expect(mockSubscriptionRepository.select).toHaveBeenCalledWith({
      field: "id_subscription",
      value: mockUUID.id_subscription,
    });
    expect(mockSubscriptionRepository.remove).toHaveBeenCalledWith({
      field: "id_subscription",
      value: mockUUID.id_subscription,
    });
    expect(result.status.description).toBe("SUBSCRIPTION_REMOVED");
    expect(result.status.code).toBe(204);
  });

  it("should throw an exception if subscription does not exist", async () => {
    const input = {
      payload: {
        subscription: {
          field: "id_subscription",
          value: mockUUID.id_subscription,
        },
      },
    };

    mockSubscriptionRepository.select.mockResolvedValue(null);

    await expect(service.execute(input)).rejects.toThrow(AppException);
    expect(mockSubscriptionRepository.select).toHaveBeenCalledWith({
      field: "id_subscription",
      value: mockUUID.id_subscription,
    });
    expect(mockSubscriptionRepository.remove).not.toHaveBeenCalled();
  });

  it("should throw an exception if subscription removal fails", async () => {
    const input = {
      payload: {
        subscription: {
          field: "id_subscription",
          value: mockUUID.id_subscription,
        },
      },
    };

    const originalResource = {
      id_subscription: mockUUID.id_subscription,
      id_account: mockUUID.id_account,
      type: "FREE",
      status: "ACTIVE",
    };

    mockSubscriptionRepository.select.mockResolvedValue(originalResource);
    mockSubscriptionRepository.remove.mockResolvedValue(false);

    await expect(service.execute(input)).rejects.toThrow(AppException);
    expect(mockSubscriptionRepository.select).toHaveBeenCalled();
    expect(mockSubscriptionRepository.remove).toHaveBeenCalled();
  });

  it("should throw an exception if subscription field is not provided", async () => {
    const input = {
      payload: {},
    };

    await expect(service.execute(input)).rejects.toThrow(AppException);
    expect(mockSubscriptionRepository.select).not.toHaveBeenCalled();
    expect(mockSubscriptionRepository.remove).not.toHaveBeenCalled();
  });
});
