import { BaseRepository } from "../../../common/abstracts";
import { settings } from "../../../core/settings";

import type { MapperPort } from "../../../common/ports";
import type { ProductModule } from "@types";

class WorkRepository extends BaseRepository<
  ProductModule.DTO.ViewModel.Work,
  ProductModule.DTO.EntityModel.Work,
  ProductModule.DTO.DataModel.Work
> {
  constructor(
    mapper: MapperPort<
      ProductModule.DTO.ViewModel.Work,
      ProductModule.DTO.EntityModel.Work,
      ProductModule.DTO.DataModel.Work
    >,
    databaseName: keyof typeof settings.database,
    schemas: { data: string; read: string },
    tableName: string,
    columnConstraints: string[],
  ) {
    super(mapper, databaseName, schemas, tableName, columnConstraints);
  }
}

export { WorkRepository };
