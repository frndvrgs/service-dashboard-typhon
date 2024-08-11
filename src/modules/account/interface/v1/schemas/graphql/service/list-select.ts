export const adminListSelectTypeDefs = `#graphql

  """
  Input type for filtering a list of accounts based on equality,
  matching a value in a list of values, and date conditions.
  """
  input AccountListFilter {
    equal: AccountListFilterEqual
    match: AccountListFilterMatch
    date: AccountListFilterDate
  }

  """
  Input type for equality-based filtering of accounts.
  """
  input AccountListFilterEqual {
    id_account: ID
    email: String
  }

  """
  Input type for matching-based filtering of accounts.
  """
  input AccountListFilterMatch {
    id_account: [ID]
    email: [String]
  }

  """
  Input type for date-based filtering of accounts.
  """
  input AccountListFilterDate {
    created_at: ListFilterDateOptions
    updated_at: ListFilterDateOptions
  }

  """
  Input type for specifying the order and pagination of an account list.
  """
  input AccountListOrder {
    field: AccountListOrderField
    limit: Int
    offset: Int
  }

  """
  Input type for specifying the field and order for sorting an account list.
  """
  input AccountListOrderField {
    created_at: ListOrderValue
    updated_at: ListOrderValue
  }

  """
  Input type for selecting a specific account field and value.
  """
  input AccountSelect {
    field: AccountSelectField!
    value: String!
  }

  """
  An enumeration representing the fields that can be selected for an account.
  """
  enum AccountSelectField {
    id_account
    email
  }

  """
  Input type for filtering a list of subscriptions based on
  equality, matching a value in a list of values, and date conditions.
  """
  input SubscriptionListFilter {
    equal: SubscriptionListFilterEqual
    match: SubscriptionListFilterMatch
    date: SubscriptionListFilterDate
  }

  """
  Input type for equality-based filtering of subscriptions.
  """
  input SubscriptionListFilterEqual {
    id_subscription: ID
    id_account: ID
    type: String
    status: String
  }

  """
  Input type for matching-based filtering of subscriptions.
  """
  input SubscriptionListFilterMatch {
    id_subscription: [ID]
    id_account: [ID]
    type: [String]
    status: [String]
  }

  """
  Input type for date-based filtering of subscriptions.
  """
  input SubscriptionListFilterDate {
    created_at: ListFilterDateOptions
    updated_at: ListFilterDateOptions
  }

  """
  Input type for specifying the order and pagination of a subscription list.
  """
  input SubscriptionListOrder {
    field: SubscriptionListOrderField
    limit: Int
    offset: Int
  }

  """
  Input type for specifying the field and order for sorting a subscription list.
  """
  input SubscriptionListOrderField {
    created_at: ListOrderValue
    updated_at: ListOrderValue
  }

  """
  Input type for selecting a specific subscription field and value.
  """
  input SubscriptionSelect {
    field: SubscriptionSelectField!
    value: String!
  }

  """
  An enumeration representing the fields that can be selected for a profile.
  """
  enum SubscriptionSelectField {
    id_subscription
    id_account
  }

  """
  Input type for equality-based filtering of works.
  """
  input WorkListFilterEqual {         ## expands WorkListFilterEqual
    id_account: ID
  }

  """
  Input type for matching-based filtering of works.
  """
  input WorkListFilterMatch {         ## expands WorkListFilterMatch
    id_account: [ID]
  }

  """
  An enumeration representing the fields that can be selected for a profile.
  """
  enum WorkSelectField {
    id_account
    id_work
  }

  """
  Input type for equality-based filtering of profiles.
  """
  input ProfileListFilterEqual {      ## expands ProfileListFilterEqual
    id_account: ID
  }

  """
  Input type for matching-based filtering of profiles.
  """
  input ProfileListFilterMatch {      ## expands ProfileListFilterMatch
    id_account: [ID]
  }

`;
