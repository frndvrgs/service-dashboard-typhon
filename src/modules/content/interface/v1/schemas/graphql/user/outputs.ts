export const userOutputsTypeDefs = `#graphql

  """
  Output type for a single subscription, including the HTTP request status.
  """
  type SubscriptionOutput {
    status: HttpStatus
    output: AccountSubscription
  }

  """
  Output type for a list of works, including the HTTP request status.
  """
  type WorksOutput {
    status: HttpStatus
    output: [Work]
  }

  """
  Output type for a single work, including the HTTP request status.
  """
  type WorkOutput {
    status: HttpStatus
    output: Work
  }

  """
  Output type for a list of features, including the HTTP request status.
  """
  type FeaturesOutput {
    status: HttpStatus
    output: [Feature]
  }

  """
  Output type for a single account, including the HTTP request status.
  """
  type FeatureOutput {
    status: HttpStatus
    output: Feature
  }

`;
