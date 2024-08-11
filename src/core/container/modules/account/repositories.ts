import { settings } from "../../../../core/settings";
import { container } from "../../container.handler";

import {
  accountMapper,
  subscriptionMapper,
} from "../../../../modules/account/mappers";
import {
  AccountRepository,
  SubscriptionRepository,
} from "../../../../modules/account/repositories";

const {
  database: { account: accountDatabase },
} = settings;

container.set([
  container.register(
    "accountRepository",
    () =>
      new AccountRepository(
        accountMapper,
        accountDatabase.databaseModuleName,
        accountDatabase.schemas,
        accountDatabase.tables.account.name,
        accountDatabase.tables.account.columnConstraints,
      ),
  ),
  container.register(
    "subscriptionRepository",
    () =>
      new SubscriptionRepository(
        subscriptionMapper,
        accountDatabase.databaseModuleName,
        accountDatabase.schemas,
        accountDatabase.tables.subscription.name,
        accountDatabase.tables.subscription.columnConstraints,
      ),
  ),
]);
