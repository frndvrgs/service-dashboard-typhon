export const publicListSelectTypeDefs = `#graphql

  """
  Input type for filtering a list of profiles based on equality,
  matching a value in a list of values, and date conditions.
  """
  input ProfileListFilter {
    equal: ProfileListFilterEqual
    match: ProfileListFilterMatch
    date: ProfileListFilterDate
  }

  """
  Input type for equality-based filtering of profiles.
  """
  input ProfileListFilterEqual {
    id_profile: ID
    username: String
  }

  """
  Input type for matching-based filtering of profiles.
  """
  input ProfileListFilterMatch {
    id_profile: [ID]
    username: [String]
  }

  """
  Input type for date-based filtering of profiles.
  """
  input ProfileListFilterDate {
    created_at: ListFilterDateOptions
    updated_at: ListFilterDateOptions
  }

  """
  Input type for specifying the order and pagination of a profile list.
  """
  input ProfileListOrder {
    field: ProfileListOrderField
    limit: Int
    offset: Int
  }

  """
  Input type for specifying the field and order for sorting a profile list.
  """
  input ProfileListOrderField {
    created_at: ListOrderValue
    updated_at: ListOrderValue
  }

  """
  Input type for selecting a specific profile field and value.
  """
  input ProfileSelect {
    field: ProfileSelectField!
    value: String!
  }

  """
  An enumeration representing the fields that can be selected for a profile.
  """
  enum ProfileSelectField {
    id_profile
    username
  }

`;
