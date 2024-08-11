export const userDataModelsTypeDefs = `#graphql

  "Represents the AccountSubscription ViewModel DTO."
  type AccountSubscription {
    id_subscription: ID!
    id_account: ID!
    created_at: DateTime
    updated_at: DateTime
    type: String
    status: String
    document: JSON
  }

  "Represents the Work ViewModel DTO."
  type Work {
    id_work: ID
    id_account: ID
    id_feature: ID
    created_at: DateTime
    updated_at: DateTime
    name: String
    level: Float
    document: JSON
  }

  "Represents the Feature ViewModel DTO."
  type Feature {
    id_feature: ID!
    created_at: DateTime
    updated_at: DateTime
    name: String
    subscription_scope: [SubscriptionType]
    document: JSON
  }

`;
