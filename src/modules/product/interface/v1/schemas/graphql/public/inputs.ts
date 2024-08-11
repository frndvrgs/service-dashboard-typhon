export const publicInputsTypeDefs = `#graphql

  """
  Input type for creating a new account.
  """
  input CreateAccount {
    email: String!
    password: String!
  }

`;
