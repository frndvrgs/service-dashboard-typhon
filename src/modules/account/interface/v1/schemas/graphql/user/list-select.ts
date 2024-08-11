export const userListSelectTypeDefs = `#graphql

  """
  Input type for filtering a list of works based on equality,
  matching a value in a list of values, and date conditions.
  """
  input WorkListFilter {
    equal: WorkListFilterEqual
    match: WorkListFilterMatch
    date: WorkListFilterDate
  }

  """
  Input type for equality-based filtering of works.
  """
  input WorkListFilterEqual {
    id_work: ID
    id_feature: ID
  }

  """
  Input type for matching-based filtering of works.
  """
  input WorkListFilterMatch {
    id_work: [ID]
    id_feature: [ID]
  }

  """
  Input type for date-based filtering of works.
  """
  input WorkListFilterDate {
    created_at: ListFilterDateOptions
    updated_at: ListFilterDateOptions
  }

  """
  Input type for specifying the order and pagination of a work list.
  """
  input WorkListOrder {
    field: WorkListOrderField
    limit: Int
    offset: Int
  }

  """
  Input type for specifying the field and order for sorting a work list.
  """
  input WorkListOrderField {
    created_at: ListOrderValue
    updated_at: ListOrderValue
  }

  """
  Input type for selecting a specific work field and value.
  """
  input WorkSelect {
    field: WorkSelectField!
    value: String!
  }

  """
  An enumeration representing the fields that can be selected for a profile.
  """
  enum WorkSelectField {
    id_work
  }

  """
  Input type for filtering a list of features based on equality,
  matching a value in a list of values, and date conditions.
  """
  input FeatureListFilter {
    equal: FeatureListFilterEqual
    match: FeatureListFilterMatch
    includes: FeatureListFilterIncludes
    date: FeatureListFilterDate
  }

  """
  Input type for equality-based filtering of features.
  """
  input FeatureListFilterEqual {
    id_feature: ID
  }

  """
  Input type for matching-based filtering of features.
  """
  input FeatureListFilterMatch {
    id_feature: [ID]
  }

  """
  Input type for value included in array filtering of features.
  """
  input FeatureListFilterIncludes {
    subscription_scope: [SubscriptionType]
  }

  """
  Input type for date-based filtering of features.
  """
  input FeatureListFilterDate {
    created_at: ListFilterDateOptions
    updated_at: ListFilterDateOptions
  }

  """
  Input type for specifying the order and pagination of a feature list.
  """
  input FeatureListOrder {
    field: FeatureListOrderField
    limit: Int
    offset: Int
  }

  """
  Input type for specifying the field and order for sorting a feature list.
  """
  input FeatureListOrderField {
    created_at: ListOrderValue
    updated_at: ListOrderValue
  }

  """
  Input type for selecting a specific feature field and value.
  """
  input FeatureSelect {
    field: FeatureSelectField!
    value: String!
  }

  """
  An enumeration representing the fields that can be selected for a profile.
  """
  enum FeatureSelectField {
    id_feature
  }

`;
