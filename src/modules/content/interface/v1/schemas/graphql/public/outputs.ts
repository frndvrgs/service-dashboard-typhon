export const publicOutputsTypeDefs = `#graphql

  """
  Output type for a single account, including the HTTP request status.
  """
  type AccountOutput {
    status: HttpStatus
    output: Account
  }

  """
  Output type for a list of profiles, including the HTTP request status.
  """
  type ProfilesOutput {
    status: HttpStatus
    output: [Profile]
  }

  """
  Output type for a single profile, including the HTTP request status.
  """
  type ProfileOutput {
    status: HttpStatus
    output: Profile
  }

`;
