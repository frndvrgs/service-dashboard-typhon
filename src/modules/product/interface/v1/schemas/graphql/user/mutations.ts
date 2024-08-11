export const userMutationsTypeDefs = `#graphql

  type Mutation {
    "Updates the account of the currently authenticated user."
    updateAccount(
      input: UpdateAccount!
    ): AccountOutput
    
    "Removes the account of the currently authenticated user."
    removeAccount: StatusOutput

    "Creates a new work with the provided input data."
    createWork(
      feature: FeatureSelect!,
      input: CreateWork!
    ): WorkOutput
    
    "Updates an existing work with the provided input data."
    updateWork(
      work: WorkSelect!,
      input: UpdateWork!
    ): WorkOutput
    
    "Removes an existing work."
    removeWork(
      work: WorkSelect!
    ): StatusOutput

    "Creates a new profile with the provided input data."
    createProfile(
      input: CreateProfile!
    ): ProfileOutput
    
    "Updates an existing profile with the provided input data."
    updateProfile(
      input: UpdateProfile!
    ): ProfileOutput
    
    "Removes the profile of the currently authenticated user."
    removeProfile: StatusOutput

  }

`;
