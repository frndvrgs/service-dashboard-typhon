import type { ContentModule } from "@types";

export const featureMapper: ContentModule.Port.Mapper.Feature = {
  mapDataToEntity(resource) {
    const {
      id_feature,
      created_at,
      updated_at,
      name,
      subscription_scope,
      document,
    } = resource;
    return {
      id: id_feature,
      createdAt: created_at,
      updatedAt: updated_at,
      name,
      subscriptionScope: subscription_scope,
      document,
    };
  },
  mapEntityToData(entity) {
    const { id, createdAt, updatedAt, name, subscriptionScope, document } =
      entity;
    return {
      id_feature: id,
      created_at: createdAt,
      updated_at: updatedAt,
      name,
      subscription_scope: subscriptionScope,
      document,
    };
  },
  mapDataToView(data) {
    // DataModel and ViewModel matchs in this case
    return data;
  },
};
