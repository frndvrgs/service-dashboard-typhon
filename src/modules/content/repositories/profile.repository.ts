import { BaseRepository } from "../../../common/abstracts";
import { settings } from "../../../core/settings";

import type { MapperPort } from "../../../common/ports";
import type { ContentModule } from "@types";

class ProfileRepository extends BaseRepository<
  ContentModule.DTO.ViewModel.Profile,
  ContentModule.DTO.EntityModel.Profile,
  ContentModule.DTO.DataModel.Profile
> {
  constructor(
    mapper: MapperPort<
      ContentModule.DTO.ViewModel.Profile,
      ContentModule.DTO.EntityModel.Profile,
      ContentModule.DTO.DataModel.Profile
    >,
    databaseName: keyof typeof settings.database,
    schemas: { data: string; read: string },
    tableName: string,
    columnConstraints: string[],
  ) {
    super(mapper, databaseName, schemas, tableName, columnConstraints);
  }
}

export { ProfileRepository };
