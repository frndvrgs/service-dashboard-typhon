export const adminQueriesTypeDefs = `#graphql

type Query {

    """
    **listAccounts(filter, order)** Retrieves a list of
    accounts based on the specified filter and order.
    """
    listAccounts(
      filter: AccountListFilter,
      order: AccountListOrder
    ): AccountsOutput
    
    ## expands readAccount()
    # """
    # **readAccount(select)** Retrieves a specific account
    # based on the selected field and value.
    # """
    readAccount(
      select: [AccountSelect]!
    ): AccountOutput

    """
    **listSubscriptions(filter, order)** Retrieves a list
    of subscriptions based on the specified filter and order.
    """
    listSubscriptions(
      filter: SubscriptionListFilter,
      order: SubscriptionListOrder
    ): SubscriptionsOutput

    ## expands readSubscription()
    """
    **readSubscription(select)**  Retrieves a specific subscription
    based on the selected field and value.
    """
    readSubscription(
      select: [SubscriptionSelect]!
    ): SubscriptionOutput

    ## expands listWorks()
    """
    **listWorks(filter, order)** Retrieves a list of
    works based on the specified filter and order.
    """
    listWorks(
      filter: WorkListFilter,
    ): WorksOutput
}

`;
