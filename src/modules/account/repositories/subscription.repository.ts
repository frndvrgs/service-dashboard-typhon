import { BaseRepository } from "../../../common/abstracts";
import { settings } from "../../../core/settings";

import type { MapperPort } from "../../../common/ports";
import type { AccountModule } from "@types";

class SubscriptionRepository extends BaseRepository<
  AccountModule.DTO.ViewModel.Subscription,
  AccountModule.DTO.EntityModel.Subscription,
  AccountModule.DTO.DataModel.Subscription
> {
  constructor(
    mapper: MapperPort<
      AccountModule.DTO.ViewModel.Subscription,
      AccountModule.DTO.EntityModel.Subscription,
      AccountModule.DTO.DataModel.Subscription
    >,
    databaseName: keyof typeof settings.database,
    schemas: { data: string; read: string },
    tableName: string,
    columnConstraints: string[],
  ) {
    super(mapper, databaseName, schemas, tableName, columnConstraints);
  }
}

export { SubscriptionRepository };
