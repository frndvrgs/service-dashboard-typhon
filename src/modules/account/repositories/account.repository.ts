import { BaseRepository } from "../../../common/abstracts";
import { settings } from "../../../core/settings";

import type { MapperPort } from "../../../common/ports";
import type { AccountModule } from "@types";

class AccountRepository extends BaseRepository<
  AccountModule.DTO.ViewModel.Account,
  AccountModule.DTO.EntityModel.Account,
  AccountModule.DTO.DataModel.Account
> {
  constructor(
    mapper: MapperPort<
      AccountModule.DTO.ViewModel.Account,
      AccountModule.DTO.EntityModel.Account,
      AccountModule.DTO.DataModel.Account
    >,
    databaseName: keyof typeof settings.database,
    schemas: { data: string; read: string },
    tableName: string,
    columnConstraints: string[],
  ) {
    super(mapper, databaseName, schemas, tableName, columnConstraints);
  }
}

export { AccountRepository };
