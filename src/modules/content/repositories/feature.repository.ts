import { BaseRepository } from "../../../common/abstracts";
import { settings } from "../../../core/settings";

import type { MapperPort } from "../../../common/ports";
import type { ContentModule } from "@types";

class FeatureRepository extends BaseRepository<
  ContentModule.DTO.ViewModel.Feature,
  ContentModule.DTO.EntityModel.Feature,
  ContentModule.DTO.DataModel.Feature
> {
  constructor(
    mapper: MapperPort<
      ContentModule.DTO.ViewModel.Feature,
      ContentModule.DTO.EntityModel.Feature,
      ContentModule.DTO.DataModel.Feature
    >,
    databaseName: keyof typeof settings.database,
    schemas: { data: string; read: string },
    tableName: string,
    columnConstraints: string[],
  ) {
    super(mapper, databaseName, schemas, tableName, columnConstraints);
  }
}

export { FeatureRepository };
