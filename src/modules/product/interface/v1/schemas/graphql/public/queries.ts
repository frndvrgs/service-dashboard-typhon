export const publicQueriesTypeDefs = `#graphql

  type Query {
    """
    **listProfiles(filter, order)** Retrieves a list
    of profiles based on the specified filter and order.
    """
    listProfiles(
      filter: ProfileListFilter,
      order: ProfileListOrder
    ): ProfilesOutput

    """
    **readProfile(select)** Retrieves a specific
    profile based on the selected field and value.
    """
    readProfile(
      select: [ProfileSelect]!
    ): ProfileOutput
  }

`;
