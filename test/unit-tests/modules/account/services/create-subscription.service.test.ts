import { describe, it, expect, vi, beforeEach } from "vitest";
import { CreateSubscriptionService } from "../../../../../src/modules/account/services";
import { AppException } from "../../../../../src/common/exceptions";
import { SubscriptionEntity } from "../../../../../src/modules/account/domain/entities";

import type { SubscriptionModel } from "../../../../../src/modules/account/domain/entities";

const mockAccountRepository = {
  select: vi.fn(),
};

const mockSubscriptionRepository = {
  create: vi.fn(),
};

const mockMapper = {
  mapDataToView: vi.fn(),
};

const mockUUID = {
  id_account: "082266b7-2e2f-4c8f-9007-e353f02e8512",
  id_subscription: "e34e572f-724a-45c6-b9e9-f2985cd3b0b2",
};

describe("CreateSubscriptionService", () => {
  let service: CreateSubscriptionService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new CreateSubscriptionService(
      {
        account: mockAccountRepository,
        subscription: mockSubscriptionRepository,
      },
      mockMapper,
    );
    vi.spyOn(SubscriptionEntity, "create");
  });

  it("should create a subscription successfully", async () => {
    const input = {
      payload: {
        account: { field: "id_account", value: mockUUID.id_account },
        input: {
          type: "FREE",
          status: "ACTIVE",
        },
      },
    };

    const entityExport: SubscriptionModel = {
      id: mockUUID.id_subscription,
      createdAt: "2024-08-11T11:57:43.353Z",
      updatedAt: "2024-08-11T11:57:43.353Z",
      idAccount: mockUUID.id_account,
      type: "FREE",
      status: "ACTIVE",
      document: {},
    };

    const mockSubscriptionEntity = {
      export: vi.fn().mockReturnValue(entityExport),
    };
    vi.mocked(SubscriptionEntity.create).mockReturnValue(
      mockSubscriptionEntity as unknown as SubscriptionEntity,
    );

    mockAccountRepository.select.mockResolvedValue({
      id_account: mockUUID.id_account,
      email: "test@example.com",
    });

    mockSubscriptionRepository.create.mockResolvedValue({
      id_subscription: mockUUID.id_subscription,
      id_account: mockUUID.id_account,
      type: "FREE",
      status: "ACTIVE",
    });

    mockMapper.mapDataToView.mockReturnValue({
      id: mockUUID.id_subscription,
      type: "FREE",
      status: "ACTIVE",
    });

    const result = await service.execute(input);

    expect(mockAccountRepository.select).toHaveBeenCalledWith({
      field: "id_account",
      value: mockUUID.id_account,
    });
    expect(SubscriptionEntity.create).toHaveBeenCalledWith({
      idAccount: mockUUID.id_account,
      type: "FREE",
      status: "ACTIVE",
    });
    expect(mockSubscriptionRepository.create).toHaveBeenCalledWith(
      entityExport,
    );
    expect(mockMapper.mapDataToView).toHaveBeenCalled();
    expect(result.status.description).toBe("ACCOUNT_CREATED");
    expect(result.status.code).toBe(201);
  });

  it("should throw an exception if account does not exist", async () => {
    const input = {
      payload: {
        account: { field: "id_account", value: mockUUID.id_account },
        input: {
          type: "FREE",
          status: "ACTIVE",
        },
      },
    };

    mockAccountRepository.select.mockResolvedValue(null);

    await expect(service.execute(input)).rejects.toThrow(AppException);
    expect(mockAccountRepository.select).toHaveBeenCalledWith({
      field: "id_account",
      value: mockUUID.id_account,
    });
    expect(SubscriptionEntity.create).not.toHaveBeenCalled();
  });

  it("should throw an exception if subscription creation fails", async () => {
    const input = {
      payload: {
        account: { field: "id_account", value: mockUUID.id_account },
        input: {
          type: "FREE",
          status: "ACTIVE",
        },
      },
    };

    mockAccountRepository.select.mockResolvedValue({
      id_account: mockUUID.id_account,
      email: "test@example.com",
    });

    mockSubscriptionRepository.create.mockResolvedValue(null);

    const mockSubscriptionEntity = { export: vi.fn().mockReturnValue({}) };
    vi.mocked(SubscriptionEntity.create).mockReturnValue(
      mockSubscriptionEntity as unknown as SubscriptionEntity,
    );

    await expect(service.execute(input)).rejects.toThrow(AppException);
    expect(mockSubscriptionRepository.create).toHaveBeenCalled();
  });

  it("should create a subscription with different type and status", async () => {
    const input = {
      payload: {
        account: { field: "id_account", value: mockUUID.id_account },
        input: {
          type: "CORPORATE",
          status: "ACTIVE",
        },
      },
    };

    const entityExport: SubscriptionModel = {
      id: mockUUID.id_subscription,
      createdAt: "2024-08-11T11:57:43.353Z",
      updatedAt: "2024-08-11T11:57:43.353Z",
      idAccount: mockUUID.id_account,
      type: "CORPORATE",
      status: "ACTIVE",
      document: {},
    };

    const mockSubscriptionEntity = {
      export: vi.fn().mockReturnValue(entityExport),
    };
    vi.mocked(SubscriptionEntity.create).mockReturnValue(
      mockSubscriptionEntity as unknown as SubscriptionEntity,
    );

    mockAccountRepository.select.mockResolvedValue({
      id_account: mockUUID.id_account,
      email: "test@example.com",
    });

    mockSubscriptionRepository.create.mockResolvedValue({
      id_subscription: mockUUID.id_subscription,
      id_account: mockUUID.id_account,
      type: "CORPORATE",
      status: "ACTIVE",
    });

    mockMapper.mapDataToView.mockReturnValue({
      id: mockUUID.id_subscription,
      type: "CORPORATE",
      status: "ACTIVE",
    });

    const result = await service.execute(input);

    expect(SubscriptionEntity.create).toHaveBeenCalledWith({
      idAccount: mockUUID.id_account,
      type: "CORPORATE",
      status: "ACTIVE",
    });
    expect(result.status.description).toBe("ACCOUNT_CREATED");
    expect(result.status.code).toBe(201);
  });
});
