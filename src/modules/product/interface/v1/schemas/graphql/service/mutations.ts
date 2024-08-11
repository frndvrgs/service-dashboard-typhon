export const adminMutationsTypeDefs = `#graphql

  type Mutation {

    ## expands updateAccount()
    # "Updates an existing account with the provided input data."
    updateAccount(
      account: AccountSelect!,
    ): AccountOutput
    
    ## expands removeAccount()
    # "Removes the account of the currently authenticated user."
    removeAccount(  
      account: AccountSelect!
    ): StatusOutput

    ## expands createSubscription()
    # "Creates a new subscription with the provided input data."
    createSubscription(
      account: AccountSelect!,
      input: CreateSubscription!
    ): SubscriptionOutput
    
    ## expands updateSubscription()
    # "Updates an existing subscription with the provided input data."
    updateSubscription( 
      subscription: SubscriptionSelect!,
      input: UpdateSubscription!
    ): SubscriptionOutput
  
    ## expands removeSubscription()
    # "Removes an existing subscription."
    removeSubscription(
      subscription: SubscriptionSelect!
    ): StatusOutput

    ## expands createWork()
    # "Creates a new work with the provided input data."
    createWork(
      account: AccountSelect!,
    ): WorkOutput
    
    ## expands updateWork()
    # "Creates a new work with the provided input data."
    updateWork(
      account: AccountSelect!,
    ): WorkOutput

    ## expands removeWork()
    # "Creates a new work with the provided input data."
    removeWork(
      account: AccountSelect!,
    ): StatusOutput

    ## expands createProfile()
    # "Creates a new profile with the provided input data."
    createProfile(
      account: AccountSelect!,
    ): ProfileOutput
    
    ## expands updateProfile()
    # "Updates an existing profile with the provided input data."
    updateProfile(                                      
      account: AccountSelect!,
    ): ProfileOutput
    
    ## expands removeProfile()
    # "Removes the profile of the currently authenticated user."
    removeProfile(                                      
      account: AccountSelect!,
    ): StatusOutput

    "Creates a new feature with the provided input data."
    createFeature(
      input: CreateFeature!
      ): FeatureOutput

    "Updates an existing feature with the provided input data."
    updateFeature(
      feature: FeatureSelect!,
      input: UpdateFeature!
    ): FeatureOutput

    "Removes a feature."
    removeFeature(
      feature: FeatureSelect!
    ): StatusOutput

  }

`;
