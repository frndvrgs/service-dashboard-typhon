export const publicDataModelsTypeDefs = `#graphql

  "Represents the Account ViewModel DTO."
  type Account {
    id_account: ID!
    created_at: DateTime
    updated_at: DateTime
    email: String
    document: JSON
  }

  "Represents the Profile ViewModel DTO."
  type Profile {
    id_profile: ID!
    id_account: ID!
    created_at: DateTime
    updated_at: DateTime
    username: String
    name: String
    document: JSON
  }

`;
