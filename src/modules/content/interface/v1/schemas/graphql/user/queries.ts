export const userQueriesTypeDefs = `#graphql

  type Query {
    """
    **readAccount(select)** Retrieves a specific account
    based on the selected field and value.
    """
    readAccount: AccountOutput

    """
    **readSubscription(select)**  Retrieves a specific subscription
    based on the selected field and value.
    """
    readSubscription: SubscriptionOutput

    """
    **listWorks(filter, order)** Retrieves a list of
    works based on the specified filter and order.
    """
    listWorks(
      filter: WorkListFilter,
      order: WorkListOrder
    ): WorksOutput
  
    """
    **readWork(select)** Retrieves a specific work
    based on the selected field and value.
    """
    readWork(
      select: [WorkSelect]!
    ): WorkOutput

    """
    **readProfile(select)** Retrieves a specific
    profile based on the selected field and value.
    """
    readProfile(
      select: [ProfileSelect]
    ): ProfileOutput

    """
    **listFeatures(select)** Retrieves a list of
    features based on the specified filter and order.
    """
    listFeatures(
      filter: FeatureListFilter,
      order: FeatureListOrder
    ): FeaturesOutput
  }

`;
