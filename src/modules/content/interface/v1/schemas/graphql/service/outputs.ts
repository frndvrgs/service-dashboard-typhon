export const adminOutputsTypeDefs = `#graphql

  """
  Output type for a list of accounts, including the HTTP request status.
  """
  type AccountsOutput {
    status: HttpStatus
    output: [Account]
  }

  """
  Output type for a list of subscriptions, including the HTTP request status.
  """
  type SubscriptionsOutput {
    status: HttpStatus
    output: [AccountSubscription]
  }

`;
