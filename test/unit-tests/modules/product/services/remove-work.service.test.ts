import { describe, it, expect, vi, beforeEach } from "vitest";
import { RemoveWorkService } from "../../../../../src/modules/product/services";
import { AppException } from "../../../../../src/common/exceptions";

const mockWorkRepository = {
  select: vi.fn(),
  remove: vi.fn(),
};

const mockUUID = {
  id_account: "99018dfc-14c7-471f-a035-b0dc4b6cb6d5",
  id_work: "d633bcdb-99a7-44b4-b7b8-22001a90c68c",
  nonexistent: "e34e572f-724a-45c6-b9e9-f2985cd3b0b2",
};

describe("RemoveWorkService", () => {
  let service: RemoveWorkService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new RemoveWorkService(mockWorkRepository);
  });

  it("should remove a work successfully", async () => {
    const input = {
      payload: {
        account: { field: "id_account", value: mockUUID.id_account },
        work: { field: "id_work", value: mockUUID.id_work },
      },
    };

    const originalResource = {
      id_work: mockUUID.id_work,
      id_account: mockUUID.id_account,
      name: "Test Work",
      level: 10,
      document: {
        description: "work description",
      },
    };

    mockWorkRepository.select.mockResolvedValue(originalResource);
    mockWorkRepository.remove.mockResolvedValue(true);

    const result = await service.execute(input);

    expect(mockWorkRepository.select).toHaveBeenCalledWith([
      { field: "id_account", value: mockUUID.id_account },
      { field: "id_work", value: mockUUID.id_work },
    ]);
    expect(mockWorkRepository.remove).toHaveBeenCalledWith({
      field: "id_work",
      value: mockUUID.id_work,
    });
    expect(result.status.description).toBe("WORK_REMOVED");
    expect(result.status.code).toBe(204);
  });

  it("should throw an exception if work does not exist", async () => {
    const input = {
      payload: {
        account: { field: "id_account", value: mockUUID.id_account },
        work: { field: "id_work", value: mockUUID.nonexistent },
      },
    };

    mockWorkRepository.select.mockResolvedValue(null);

    await expect(service.execute(input)).rejects.toThrow(AppException);
    expect(mockWorkRepository.select).toHaveBeenCalled();
    expect(mockWorkRepository.remove).not.toHaveBeenCalled();
  });

  it("should throw an exception if work removal fails", async () => {
    const input = {
      payload: {
        account: { field: "id_account", value: mockUUID.id_account },
        work: { field: "id_work", value: mockUUID.id_work },
      },
    };

    const originalResource = {
      id_work: mockUUID.id_work,
      id_account: mockUUID.id_account,
      name: "Test Work",
      level: 10,
      document: {
        description: "work description",
      },
    };

    mockWorkRepository.select.mockResolvedValue(originalResource);
    mockWorkRepository.remove.mockResolvedValue(false);

    await expect(service.execute(input)).rejects.toThrow(AppException);
    expect(mockWorkRepository.select).toHaveBeenCalled();
    expect(mockWorkRepository.remove).toHaveBeenCalled();
  });
});
