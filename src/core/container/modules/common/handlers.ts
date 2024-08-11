import { SessionHandler, StatusHandler } from "../../../../common/handlers";
import { container } from "../../container.handler";

container.set([
  container.register("sessionHandler", () => new SessionHandler()),
  container.register("statusHandler", () => new StatusHandler()),
]);
