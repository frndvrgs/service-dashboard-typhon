import type { ProductModule } from "@types";

export const workMapper: ProductModule.Port.Mapper.Work = {
  mapDataToEntity(resource) {
    const {
      id_work,
      id_account,
      id_feature,
      created_at,
      updated_at,
      name,
      level,
      document,
    } = resource;
    return {
      id: id_work,
      idAccount: id_account,
      idFeature: id_feature,
      createdAt: created_at,
      updatedAt: updated_at,
      name,
      level,
      document,
    };
  },
  mapEntityToData(entity) {
    const {
      id,
      idAccount,
      idFeature,
      createdAt,
      updatedAt,
      name,
      level,
      document,
    } = entity;
    return {
      id_work: id,
      id_account: idAccount,
      id_feature: idFeature,
      created_at: createdAt,
      updated_at: updatedAt,
      name,
      level,
      document,
    };
  },
  mapDataToView(data) {
    // DataModel and ViewModel matchs in this case
    return data;
  },
};
