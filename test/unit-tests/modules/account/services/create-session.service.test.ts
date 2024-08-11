import { describe, it, expect, vi, beforeEach } from "vitest";
import { CreateSessionService } from "../../../../../src/modules/account/services";
import { AppException } from "../../../../../src/common/exceptions";
import argon2 from "argon2";

vi.mock("argon2", () => ({
  default: {
    verify: vi.fn(),
  },
}));

const mockAccountRepository = {
  select: vi.fn(),
};

const mockMapper = {
  mapDataToView: vi.fn(),
};

const mockUUID = {
  id_account: "082266b7-2e2f-4c8f-9007-e353f02e8512",
};

describe("CreateSessionService", () => {
  let service: CreateSessionService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new CreateSessionService(mockAccountRepository, mockMapper);
  });

  it("should create a session successfully", async () => {
    const input = {
      payload: {
        body: {
          email: "test@example.com",
          password: "password123",
        },
      },
    };

    const accountResource = {
      id_account: mockUUID.id_account,
      email: "test@example.com",
      password: "hashedpassword123",
    };

    mockAccountRepository.select.mockResolvedValue(accountResource);
    vi.mocked(argon2.verify).mockResolvedValue(true);

    mockMapper.mapDataToView.mockReturnValue({
      id: mockUUID.id_account,
      email: "test@example.com",
    });

    const result = await service.execute(input);

    expect(mockAccountRepository.select).toHaveBeenCalledWith({
      field: "email",
      value: "test@example.com",
    });
    expect(argon2.verify).toHaveBeenCalledWith(
      "hashedpassword123",
      "password123",
    );
    expect(mockMapper.mapDataToView).toHaveBeenCalledWith(accountResource);
    expect(result.status.description).toBe("SESSION_VERIFIED");
    expect(result.status.code).toBe(202);
  });

  it("should throw an exception if account does not exist", async () => {
    const input = {
      payload: {
        body: {
          email: "nonexistent@example.com",
          password: "password123",
        },
      },
    };

    mockAccountRepository.select.mockResolvedValue(null);

    await expect(service.execute(input)).rejects.toThrow(AppException);
    expect(mockAccountRepository.select).toHaveBeenCalledWith({
      field: "email",
      value: "nonexistent@example.com",
    });
    expect(argon2.verify).not.toHaveBeenCalled();
  });

  it("should throw an exception if password is incorrect", async () => {
    const input = {
      payload: {
        body: {
          email: "test@example.com",
          password: "wrongpassword",
        },
      },
    };

    const accountResource = {
      id_account: mockUUID.id_account,
      email: "test@example.com",
      password: "hashedpassword123",
    };

    mockAccountRepository.select.mockResolvedValue(accountResource);
    vi.mocked(argon2.verify).mockResolvedValue(false);

    await expect(service.execute(input)).rejects.toThrow(AppException);
    expect(mockAccountRepository.select).toHaveBeenCalled();
    expect(argon2.verify).toHaveBeenCalledWith(
      "hashedpassword123",
      "wrongpassword",
    );
    expect(mockMapper.mapDataToView).not.toHaveBeenCalled();
  });

  it("should throw an exception if argon2.verify throws an error", async () => {
    const input = {
      payload: {
        body: {
          email: "test@example.com",
          password: "password123",
        },
      },
    };

    const accountResource = {
      id_account: mockUUID.id_account,
      email: "test@example.com",
      password: "hashedpassword123",
    };

    mockAccountRepository.select.mockResolvedValue(accountResource);
    vi.mocked(argon2.verify).mockRejectedValue(new Error("Argon2 error"));

    await expect(service.execute(input)).rejects.toThrow(Error);
    expect(mockAccountRepository.select).toHaveBeenCalled();
    expect(argon2.verify).toHaveBeenCalledWith(
      "hashedpassword123",
      "password123",
    );
    expect(mockMapper.mapDataToView).not.toHaveBeenCalled();
  });
});
