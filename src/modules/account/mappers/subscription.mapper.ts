import type { AccountModule } from "@types";

export const subscriptionMapper: AccountModule.Port.Mapper.Subscription = {
  mapDataToEntity(resource) {
    const {
      id_subscription,
      id_account,
      created_at,
      updated_at,
      type,
      status,
      document,
    } = resource;
    return {
      id: id_subscription,
      idAccount: id_account,
      createdAt: created_at,
      updatedAt: updated_at,
      type,
      status,
      document,
    };
  },
  mapEntityToData(entity) {
    const { id, idAccount, createdAt, updatedAt, type, status, document } =
      entity;
    return {
      id_subscription: id,
      id_account: idAccount,
      created_at: createdAt,
      updated_at: updatedAt,
      type,
      status,
      document,
    };
  },
  mapDataToView(data) {
    // DataModel and ViewModel matchs in this case
    return data;
  },
};
