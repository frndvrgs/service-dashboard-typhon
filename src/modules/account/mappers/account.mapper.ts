import type { AccountModule } from "@types";

export const accountMapper: AccountModule.Port.Mapper.Account = {
  mapDataToEntity(data) {
    const {
      id_account,
      created_at,
      updated_at,
      email,
      password,
      scope,
      document,
    } = data;
    return {
      id: id_account,
      createdAt: created_at,
      updatedAt: updated_at,
      email,
      password,
      scope,
      document,
    };
  },
  mapEntityToData(entity) {
    const { id, createdAt, updatedAt, email, password, scope, document } =
      entity;
    return {
      id_account: id,
      created_at: createdAt,
      updated_at: updatedAt,
      email,
      password,
      scope,
      document,
    };
  },
  mapDataToView(data) {
    const { id_account, created_at, updated_at, email, scope } = data;
    return {
      id_account,
      created_at,
      updated_at,
      email,
      scope,
    };
  },
};
