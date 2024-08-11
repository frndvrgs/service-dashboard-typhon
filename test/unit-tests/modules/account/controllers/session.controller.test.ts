import { describe, it, expect, vi, beforeEach } from "vitest";
import { SessionController } from "../../../../../src/modules/account/controllers";
import { InterfaceException } from "../../../../../src/common/exceptions";

vi.mock("../../../../../src/common/abstracts/base.controller", () => ({
  BaseController: class {
    protected status: any;
    constructor(status: any) {
      this.status = status;
    }
    protected handleErrorToREST(err: Error | unknown, reply: any) {
      if (err instanceof InterfaceException) {
        reply.code(err.status.code).send({
          status: this.status.createHttpStatus(err.status),
        });
      } else {
        reply.code(500).send({
          status: this.status.createHttpStatus({
            code: 500,
            description: "INTERNAL_SERVER_ERROR",
          }),
        });
      }
    }
  },
}));

const mockCreateSessionService = { execute: vi.fn() };
const mockStatus = { createHttpStatus: vi.fn() };
const mockValidation = { check: vi.fn() };
const mockSession = {
  authorize: vi.fn(),
  create: vi.fn(),
  remove: vi.fn(),
};

describe("SessionController", () => {
  let controller: SessionController;

  beforeEach(() => {
    vi.clearAllMocks();
    controller = new SessionController(
      mockCreateSessionService,
      mockStatus,
      mockValidation,
      mockSession,
    );
  });

  describe("createSession", () => {
    it("should create session successfully", async () => {
      const input = {
        requestType: "createSession",
        payload: { email: "test@example.com", password: "password123" },
        reply: {
          code: vi.fn().mockReturnThis(),
          send: vi.fn(),
        },
      };
      const serviceResponse = {
        status: { code: 201, description: "SESSION_CREATED" },
        output: { access_token: "token123", refresh_token: "refresh123" },
      };
      mockCreateSessionService.execute.mockResolvedValue(serviceResponse);
      mockSession.create.mockResolvedValue({
        status: serviceResponse.status,
      });
      mockStatus.createHttpStatus.mockReturnValue(serviceResponse.status);

      await controller.createSession(input);

      expect(mockValidation.check).toHaveBeenCalledWith(
        input.requestType,
        input.payload,
      );
      expect(mockCreateSessionService.execute).toHaveBeenCalledWith({
        payload: input.payload,
      });
      expect(mockSession.create).toHaveBeenCalledWith(
        input.reply,
        serviceResponse.output,
      );
      expect(mockStatus.createHttpStatus).toHaveBeenCalledWith(
        serviceResponse.status,
      );
      expect(input.reply.code).toHaveBeenCalledWith(
        serviceResponse.status.code,
      );
      expect(input.reply.send).toHaveBeenCalledWith({
        status: serviceResponse.status,
      });
    });
  });

  describe("removeSession", () => {
    it("should remove session successfully", async () => {
      const input = {
        request: {},
        reply: {
          code: vi.fn().mockReturnThis(),
          send: vi.fn(),
        },
      };
      const sessionResponse = {
        status: { code: 204, description: "SESSION_REMOVED" },
      };
      mockSession.authorize.mockResolvedValue({});
      mockSession.remove.mockReturnValue(sessionResponse);
      mockStatus.createHttpStatus.mockReturnValue(sessionResponse.status);

      await controller.removeSession(input);

      expect(mockSession.authorize).toHaveBeenCalledWith(input.request);
      expect(mockSession.remove).toHaveBeenCalledWith(input.reply);
      expect(mockStatus.createHttpStatus).toHaveBeenCalledWith(
        sessionResponse.status,
      );
      expect(input.reply.code).toHaveBeenCalledWith(
        sessionResponse.status.code,
      );
      expect(input.reply.send).toHaveBeenCalledWith({
        status: sessionResponse.status,
      });
    });
  });
});
