export const adminInputsTypeDefs = `#graphql

  """
  Input type for creating a new subscription.
  """
  input CreateSubscription {
    type: SubscriptionType!
    status: SubscriptionStatus!
  }

  """
  Input type for updating an existing subscription.
  """
  input UpdateSubscription {
    type: SubscriptionType
    status: SubscriptionStatus
  }

  """
  Input type for creating a new profile.
  """
  input CreateFeature {
    name: String!
    subscription_scope: [SubscriptionType]!
    description: String
  }

  """
  Input type for updating an existing profile.
  """
  input UpdateFeature {
    name: String
    subscription_scope: [SubscriptionType]
    description: String
  }

`;
