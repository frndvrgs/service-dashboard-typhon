import { container } from "../../container.handler";

import {
  AccountController,
  SessionController,
  SubscriptionController,
} from "../../../../modules/account/controllers";

container.set([
  container.register(
    "accountController",
    () =>
      new AccountController(
        container.get("listAccountsService"),
        container.get("readAccountService"),
        container.get("createAccountService"),
        container.get("updateAccountService"),
        container.get("removeAccountService"),
        container.get("statusHandler"),
        container.get("accountValidationHandler"),
        container.get("sessionHandler"),
      ),
    "request",
  ),
  container.register(
    "sessionController",
    () =>
      new SessionController(
        container.get("createSessionService"),
        container.get("statusHandler"),
        container.get("accountValidationHandler"),
        container.get("sessionHandler"),
      ),
    "request",
  ),
  container.register(
    "subscriptionController",
    () =>
      new SubscriptionController(
        container.get("listSubscriptionsService"),
        container.get("readSubscriptionService"),
        container.get("createSubscriptionService"),
        container.get("updateSubscriptionService"),
        container.get("removeSubscriptionService"),
        container.get("statusHandler"),
        container.get("accountValidationHandler"),
        container.get("sessionHandler"),
      ),
    "request",
  ),
]);
