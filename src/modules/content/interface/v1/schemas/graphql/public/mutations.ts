export const publicMutationsTypeDefs = `#graphql

  type Mutation {
    "Creates a new account with the provided input data."
    createAccount(input: CreateAccount!): AccountOutput
  }

`;
