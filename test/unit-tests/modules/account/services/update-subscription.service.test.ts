import { describe, it, expect, vi, beforeEach } from "vitest";
import { UpdateSubscriptionService } from "../../../../../src/modules/account/services";
import { AppException } from "../../../../../src/common/exceptions";
import { SubscriptionEntity } from "../../../../../src/modules/account/domain/entities";

import type { SubscriptionModel } from "../../../../../src/modules/account/domain/entities";

const mockSubscriptionRepository = {
  select: vi.fn(),
  update: vi.fn(),
};

const mockMapper = {
  mapDataToEntity: vi.fn(),
  mapDataToView: vi.fn(),
};

const mockUUID = {
  id_account: "082266b7-2e2f-4c8f-9007-e353f02e8512",
  id_subscription: "e34e572f-724a-45c6-b9e9-f2985cd3b0b2",
};

describe("UpdateSubscriptionService", () => {
  let service: UpdateSubscriptionService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new UpdateSubscriptionService(
      mockSubscriptionRepository,
      mockMapper,
    );
    vi.spyOn(SubscriptionEntity, "import");
  });

  it("should update a subscription successfully", async () => {
    const input = {
      payload: {
        subscription: {
          field: "id_subscription",
          value: mockUUID.id_subscription,
        },
        input: {
          type: "PREMIUM",
          status: "ACTIVE",
        },
      },
    };

    const originalResource = {
      id_subscription: mockUUID.id_subscription,
      id_account: mockUUID.id_account,
      type: "FREE",
      status: "ACTIVE",
      document: {},
    };

    const entityExport: SubscriptionModel = {
      id: mockUUID.id_subscription,
      createdAt: "2024-08-11T11:57:43.353Z",
      updatedAt: "2024-08-12T10:30:00.000Z",
      idAccount: mockUUID.id_account,
      type: "PREMIUM",
      status: "ACTIVE",
      document: {},
    };

    const mockSubscriptionEntity = {
      update: vi.fn(),
      export: vi.fn().mockReturnValue(entityExport),
    };
    vi.mocked(SubscriptionEntity.import).mockReturnValue(
      mockSubscriptionEntity as unknown as SubscriptionEntity,
    );

    mockSubscriptionRepository.select.mockResolvedValue(originalResource);
    mockMapper.mapDataToEntity.mockReturnValue({});

    mockSubscriptionRepository.update.mockResolvedValue({
      id_subscription: mockUUID.id_subscription,
      id_account: mockUUID.id_account,
      type: "PREMIUM",
      status: "ACTIVE",
    });

    mockMapper.mapDataToView.mockReturnValue({
      id: mockUUID.id_subscription,
      type: "PREMIUM",
      status: "ACTIVE",
    });

    const result = await service.execute(input);

    expect(mockSubscriptionRepository.select).toHaveBeenCalledWith({
      field: "id_subscription",
      value: mockUUID.id_subscription,
    });
    expect(SubscriptionEntity.import).toHaveBeenCalled();
    expect(mockSubscriptionEntity.update).toHaveBeenCalledWith({
      type: "PREMIUM",
      status: "ACTIVE",
      document: {},
    });
    expect(mockSubscriptionRepository.update).toHaveBeenCalledWith(
      { field: "id_subscription", value: mockUUID.id_subscription },
      entityExport,
    );
    expect(mockMapper.mapDataToView).toHaveBeenCalled();
    expect(result.status.description).toBe("SUBSCRIPTION_UPDATED");
    expect(result.status.code).toBe(200);
  });

  it("should throw an exception if subscription does not exist", async () => {
    const input = {
      payload: {
        subscription: {
          field: "id_subscription",
          value: mockUUID.id_subscription,
        },
        input: {
          type: "PREMIUM",
          status: "ACTIVE",
        },
      },
    };

    mockSubscriptionRepository.select.mockResolvedValue(null);

    await expect(service.execute(input)).rejects.toThrow(AppException);
    expect(mockSubscriptionRepository.select).toHaveBeenCalledWith({
      field: "id_subscription",
      value: mockUUID.id_subscription,
    });
    expect(SubscriptionEntity.import).not.toHaveBeenCalled();
  });

  it("should throw an exception if subscription update fails", async () => {
    const input = {
      payload: {
        subscription: {
          field: "id_subscription",
          value: mockUUID.id_subscription,
        },
        input: {
          type: "PREMIUM",
          status: "ACTIVE",
        },
      },
    };

    const originalResource = {
      id_subscription: mockUUID.id_subscription,
      id_account: mockUUID.id_account,
      type: "FREE",
      status: "ACTIVE",
      document: {},
    };

    mockSubscriptionRepository.select.mockResolvedValue(originalResource);
    mockMapper.mapDataToEntity.mockReturnValue({});

    const mockSubscriptionEntity = {
      update: vi.fn(),
      export: vi.fn().mockReturnValue({}),
    };
    vi.mocked(SubscriptionEntity.import).mockReturnValue(
      mockSubscriptionEntity as unknown as SubscriptionEntity,
    );

    mockSubscriptionRepository.update.mockResolvedValue(null);

    await expect(service.execute(input)).rejects.toThrow(AppException);
    expect(mockSubscriptionRepository.update).toHaveBeenCalled();
  });

  it("should update a subscription with additional document fields", async () => {
    const input = {
      payload: {
        subscription: {
          field: "id_subscription",
          value: mockUUID.id_subscription,
        },
        input: {
          type: "CORPORATE",
          status: "PENDING",
          maxUsers: 10,
          expirationDate: "2025-01-01",
        },
      },
    };

    const originalResource = {
      id_subscription: mockUUID.id_subscription,
      id_account: mockUUID.id_account,
      type: "PREMIUM",
      status: "ACTIVE",
      document: {},
    };

    const entityExport: SubscriptionModel = {
      id: mockUUID.id_subscription,
      createdAt: "2024-08-11T11:57:43.353Z",
      updatedAt: "2024-08-12T10:30:00.000Z",
      idAccount: mockUUID.id_account,
      type: "CORPORATE",
      status: "PENDING",
      document: {
        maxUsers: 10,
        expirationDate: "2025-01-01",
      },
    };

    const mockSubscriptionEntity = {
      update: vi.fn(),
      export: vi.fn().mockReturnValue(entityExport),
    };
    vi.mocked(SubscriptionEntity.import).mockReturnValue(
      mockSubscriptionEntity as unknown as SubscriptionEntity,
    );

    mockSubscriptionRepository.select.mockResolvedValue(originalResource);
    mockMapper.mapDataToEntity.mockReturnValue({});

    mockSubscriptionRepository.update.mockResolvedValue({
      id_subscription: mockUUID.id_subscription,
      id_account: mockUUID.id_account,
      type: "CORPORATE",
      status: "PENDING",
      document: {
        maxUsers: 10,
        expirationDate: "2025-01-01",
      },
    });

    mockMapper.mapDataToView.mockReturnValue({
      id: mockUUID.id_subscription,
      type: "CORPORATE",
      status: "PENDING",
      maxUsers: 10,
      expirationDate: "2025-01-01",
    });

    const result = await service.execute(input);

    expect(mockSubscriptionEntity.update).toHaveBeenCalledWith({
      type: "CORPORATE",
      status: "PENDING",
      document: {
        maxUsers: 10,
        expirationDate: "2025-01-01",
      },
    });
    expect(result.status.description).toBe("SUBSCRIPTION_UPDATED");
    expect(result.status.code).toBe(200);
  });
});
