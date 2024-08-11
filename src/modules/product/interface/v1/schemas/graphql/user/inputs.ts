export const userInputsTypeDefs = `#graphql

  """
  Input type for updating an existing account.
  """
  input UpdateAccount {
    email: String
    password: String
  }

  """
  Input type for creating a new work.
  """
  input CreateWork {
    name: String!
    level: Float!
    description: String
  }

  """
  Input type for updating an existing work.
  """
  input UpdateWork {
    name: String
    level: Float
    description: String
  }

  """
  Input type for creating a new profile.
  """
  input CreateProfile {
    username: String!
    name: String
    image_url: String
    description: String
    website_url: String
    location: String
  }

  """
  Input type for updating an existing profile.
  """
  input UpdateProfile {
    username: String
    name: String
    image_url: String
    description: String
    website_url: String
    location: String
  }

`;
