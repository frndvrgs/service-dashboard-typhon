import { describe, it, expect, vi, beforeEach } from "vitest";
import { CreateWorkService } from "../../../../../src/modules/product/services";
import { AppException } from "../../../../../src/common/exceptions";
import { WorkEntity } from "../../../../../src/modules/product/domain/entities";

import type { WorkModel } from "../../../../../src/modules/product/domain/entities";

const mockAccountRepository = {
  select: vi.fn(),
};

const mockSubscriptionRepository = {
  select: vi.fn(),
};

const mockFeatureRepository = {
  select: vi.fn(),
};

const mockWorkRepository = {
  create: vi.fn(),
};

const mockMapper = {
  mapDataToView: vi.fn(),
};

const mockUUID = {
  id_account: "99018dfc-14c7-471f-a035-b0dc4b6cb6d5",
  id_feature: "082266b7-2e2f-4c8f-9007-e353f02e8512",
  id_work: "d633bcdb-99a7-44b4-b7b8-22001a90c68c",
  nonexistent: "e34e572f-724a-45c6-b9e9-f2985cd3b0b2",
};

describe("CreateWorkService", () => {
  let service: CreateWorkService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new CreateWorkService(
      {
        account: mockAccountRepository,
        subscription: mockSubscriptionRepository,
        feature: mockFeatureRepository,
        work: mockWorkRepository,
      },
      mockMapper,
    );
    vi.spyOn(WorkEntity, "create");
  });

  it("should create a work successfully", async () => {
    const input = {
      payload: {
        account: { field: "id_account", value: mockUUID.id_account },
        feature: { field: "id_feature", value: mockUUID.id_feature },
        input: {
          name: "Test Work",
          level: 10,
          description: "work description",
        },
      },
    };

    mockAccountRepository.select.mockResolvedValue({
      id_account: mockUUID.id_account,
    });
    mockFeatureRepository.select.mockResolvedValue({
      id_feature: mockUUID.id_feature,
      name: "Test Feature",
      subscription_scope: ["BASIC"],
    });
    mockSubscriptionRepository.select.mockResolvedValue({ type: "BASIC" });

    const entityExport: WorkModel = {
      id: mockUUID.id_work,
      createdAt: "2024-08-11T11:57:43.353Z",
      updatedAt: "2024-08-11T11:57:43.353Z",
      idAccount: mockUUID.id_account,
      idFeature: mockUUID.id_feature,
      name: "Test Work",
      level: 10,
      document: {
        description: "work description",
        feature_name: "Test Feature",
        feature_tier: "BASIC",
      },
    };

    const mockWorkEntity = { export: vi.fn().mockReturnValue(entityExport) };
    vi.mocked(WorkEntity.create).mockReturnValue(
      mockWorkEntity as unknown as WorkEntity,
    );

    const resource = {
      id_work: mockUUID.id_work,
      id_account: mockUUID.id_account,
      id_feature: mockUUID.id_feature,
      name: "Test Work",
      level: 10,
      document: {
        description: "work description",
        feature_name: "Test Feature",
        feature_tier: "BASIC",
      },
    };

    mockWorkRepository.create.mockResolvedValue(resource);
    mockMapper.mapDataToView.mockReturnValue({});

    const result = await service.execute(input);

    expect(mockWorkRepository.create).toHaveBeenCalledWith(entityExport);
    expect(mockMapper.mapDataToView).toHaveBeenCalled();
    expect(result.status.description).toBe("FEATURE_CREATED");
    expect(result.status.code).toBe(201);
  });

  it("should throw an exception if account does not exist", async () => {
    const input = {
      payload: {
        account: { field: "id_account", value: mockUUID.id_account },
        feature: { field: "id_feature", value: mockUUID.id_feature },
        input: {
          name: "Test Work",
          level: 10,
        },
      },
    };

    mockAccountRepository.select.mockResolvedValue(null);

    await expect(service.execute(input)).rejects.toThrow(AppException);
    expect(mockAccountRepository.select).toHaveBeenCalled();
  });

  it("should throw an exception if feature does not exist", async () => {
    const input = {
      payload: {
        account: { field: "id_account", value: mockUUID.id_account },
        feature: { field: "id_feature", value: mockUUID.id_feature },
        input: {
          name: "Test Work",
          level: 10,
        },
      },
    };

    mockAccountRepository.select.mockResolvedValue({
      id_account: mockUUID.id_account,
    });
    mockFeatureRepository.select.mockResolvedValue(null);

    await expect(service.execute(input)).rejects.toThrow(AppException);
    expect(mockFeatureRepository.select).toHaveBeenCalled();
  });

  it("should throw an exception if subscription does not exist", async () => {
    const input = {
      payload: {
        account: { field: "id_account", value: mockUUID.id_account },
        feature: { field: "id_feature", value: mockUUID.id_feature },
        input: {
          name: "Test Work",
          level: 10,
        },
      },
    };

    mockAccountRepository.select.mockResolvedValue({
      id_account: mockUUID.id_account,
    });
    mockFeatureRepository.select.mockResolvedValue({
      id_feature: mockUUID.id_feature,
    });
    mockSubscriptionRepository.select.mockResolvedValue(null);

    await expect(service.execute(input)).rejects.toThrow(AppException);
    expect(mockSubscriptionRepository.select).toHaveBeenCalled();
  });

  it("should throw an exception if subscription type does not allow feature", async () => {
    const input = {
      payload: {
        account: { field: "id_account", value: mockUUID.id_account },
        feature: { field: "id_feature", value: mockUUID.id_feature },
        input: {
          name: "Test Work",
          level: 10,
        },
      },
    };

    mockAccountRepository.select.mockResolvedValue({
      id_account: mockUUID.id_account,
    });
    mockFeatureRepository.select.mockResolvedValue({
      id_feature: mockUUID.id_feature,
      subscription_scope: ["CORPORATE"],
    });
    mockSubscriptionRepository.select.mockResolvedValue({ type: "BASIC" });

    await expect(service.execute(input)).rejects.toThrow(AppException);
  });

  it("should throw an exception if work creation fails", async () => {
    const input = {
      payload: {
        account: { field: "id_account", value: mockUUID.id_account },
        feature: { field: "id_feature", value: mockUUID.id_feature },
        input: {
          name: "Test Work",
          level: 10,
        },
      },
    };

    mockAccountRepository.select.mockResolvedValue({
      id_account: mockUUID.id_account,
    });
    mockFeatureRepository.select.mockResolvedValue({
      id_feature: mockUUID.id_feature,
      name: "Test Feature",
      subscription_scope: ["BASIC"],
    });
    mockSubscriptionRepository.select.mockResolvedValue({ type: "BASIC" });
    mockWorkRepository.create.mockResolvedValue(null);

    await expect(service.execute(input)).rejects.toThrow(AppException);
    expect(mockWorkRepository.create).toHaveBeenCalled();
  });
});
