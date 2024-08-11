const commonTypeDefs = `#graphql

  schema {
    query: Query
    mutation: Mutation
  }

  scalar DateTime
  scalar JSON

  """
  Input type for specifying date options in profile filtering.
  """
  input ListFilterDateOptions {
    before: String
    after: String
    within: String
  }

  """
  An enumeration representing the order values for sorting lists.
  """
  enum ListOrderValue {
    ASC
    DESC
  }

  """
  An enumeration representing Subscription types.
  """
  enum SubscriptionType {
    FREE
    BASIC
    CORPORATE
  }

  enum SubscriptionStatus {
    ACTIVE
    INACTIVE
  }

  """
  Represents the status of a HTTP response.
  """
  type HttpStatus {
    type: String
    name: String
    description: String
    code: Int
    context: String
    scope: String
    message: String
    detail: String
    validation: [JSON]
  }

  """
  Output type for the status of an operation.
  """
  type StatusOutput {
    status: HttpStatus
  }

`;

export { commonTypeDefs };
