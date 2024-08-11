import type { ContentModule } from "@types";

export const profileMapper: ContentModule.Port.Mapper.Profile = {
  mapDataToEntity(resource) {
    const {
      id_profile,
      id_account,
      created_at,
      updated_at,
      username,
      name,
      document,
    } = resource;
    return {
      id: id_profile,
      idAccount: id_account,
      createdAt: created_at,
      updatedAt: updated_at,
      username,
      name,
      document,
    };
  },
  mapEntityToData(entity) {
    const { id, idAccount, createdAt, updatedAt, username, name, document } =
      entity;
    return {
      id_profile: id,
      id_account: idAccount,
      created_at: createdAt,
      updated_at: updatedAt,
      username,
      name,
      document,
    };
  },
  mapDataToView(data) {
    // DataModel and ViewModel matchs in this case
    return data;
  },
};
