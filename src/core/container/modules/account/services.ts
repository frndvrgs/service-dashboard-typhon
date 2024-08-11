import { container } from "../../container.handler";

import {
  accountMapper,
  subscriptionMapper,
} from "../../../../modules/account/mappers";
import { ListService, ReadService } from "../../../../common/services";
import {
  CreateAccountService,
  UpdateAccountService,
  RemoveAccountService,
  CreateSubscriptionService,
  UpdateSubscriptionService,
  RemoveSubscriptionService,
  CreateSessionService,
} from "../../../../modules/account/services";

container.set([
  // ----------------------------------------------------------------
  // Account
  container.register(
    "listAccountsService",
    () => new ListService(container.get("accountRepository")),
  ),
  container.register(
    "readAccountService",
    () => new ReadService(container.get("accountRepository")),
  ),
  container.register(
    "createAccountService",
    () =>
      new CreateAccountService(
        {
          createSubscription: container.get("createSubscriptionService"),
        },
        container.get("accountRepository"),
        accountMapper,
      ),
  ),
  container.register(
    "updateAccountService",
    () =>
      new UpdateAccountService(
        container.get("accountRepository"),
        accountMapper,
      ),
  ),
  container.register(
    "removeAccountService",
    () => new RemoveAccountService(container.get("accountRepository")),
  ),
  // ----------------------------------------------------------------
  // Session
  container.register(
    "createSessionService",
    () =>
      new CreateSessionService(
        container.get("accountRepository"),
        accountMapper,
      ),
  ),
  // ----------------------------------------------------------------
  // Subscription
  container.register(
    "listSubscriptionsService",
    () => new ListService(container.get("subscriptionRepository")),
  ),
  container.register(
    "readSubscriptionService",
    () => new ReadService(container.get("subscriptionRepository")),
  ),
  container.register(
    "createSubscriptionService",
    () =>
      new CreateSubscriptionService(
        {
          account: container.get("accountRepository"),
          subscription: container.get("subscriptionRepository"),
        },
        subscriptionMapper,
      ),
  ),
  container.register(
    "updateSubscriptionService",
    () =>
      new UpdateSubscriptionService(
        container.get("subscriptionRepository"),
        subscriptionMapper,
      ),
  ),
  container.register(
    "removeSubscriptionService",
    () =>
      new RemoveSubscriptionService(container.get("subscriptionRepository")),
  ),
]);
